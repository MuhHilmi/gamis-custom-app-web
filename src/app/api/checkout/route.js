// Route API checkout: validasi ulang, hitung harga dari database, simpan
// pesanan dan itemnya, lalu buat Snap token Midtrans.
import { NextResponse } from "next/server";
import { validateCheckout } from "@/lib/validation";
import { calculateLine, subtotalOfLines, totalOf } from "@/lib/pricing";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSnapTransaction } from "@/lib/midtrans";
import { sendOrderConfirmationEmail } from "@/lib/email";

function toItems(input) {
  return Array.isArray(input?.items) ? input.items : [];
}

async function loadProducts(supabase, productIds) {
  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, base_price, lead_time_days, is_active")
    .in("id", productIds);
  if (error) throw error;
  return data || [];
}

async function loadOptions(supabase, productIds) {
  const { data, error } = await supabase
    .from("product_options")
    .select("id, product_id, type, name, price_delta, is_active")
    .in("product_id", productIds);
  if (error) throw error;
  return data || [];
}

async function loadZone(supabase, zoneId) {
  const { data, error } = await supabase
    .from("shipping_zones")
    .select("id, name, method, fee, is_active")
    .eq("id", zoneId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const validation = validateCheckout(body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: "Data checkout tidak valid", errors: validation.errors },
      { status: 400 }
    );
  }

  const data = validation.data;
  const cartItems = toItems(body);
  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Keranjang masih kosong" }, { status: 400 });
  }

  const productIds = [...new Set(cartItems.map((item) => String(item?.productId ?? item?.product_id ?? "")).filter(Boolean))];
  if (productIds.length === 0) {
    return NextResponse.json({ error: "Produk tidak valid" }, { status: 400 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    return NextResponse.json({ error: "Layanan database belum siap" }, { status: 500 });
  }

  let products;
  let options;
  let zone;
  try {
    [products, options, zone] = await Promise.all([
      loadProducts(supabase, productIds),
      loadOptions(supabase, productIds),
      loadZone(supabase, data.shippingZoneId),
    ]);
  } catch (err) {
    console.error("[checkout] gagal memuat data:", err?.message);
    return NextResponse.json({ error: "Gagal memuat data produk" }, { status: 500 });
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const activeOptionsByProduct = (productId) =>
    options.filter((o) => o.product_id === productId && o.is_active);

  // Hitung ulang harga dari database.
  const computedItems = [];
  for (let index = 0; index < cartItems.length; index += 1) {
    const item = cartItems[index];
    const productId = String(item?.productId ?? item?.product_id ?? "").trim();
    const product = productMap.get(productId);
    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: `Produk pada item ${index + 1} tidak tersedia` },
        { status: 400 }
      );
    }

    const qty = Number.isFinite(Number(item?.quantity)) ? Math.trunc(Number(item.quantity)) : 0;
    if (qty < 1) {
      return NextResponse.json(
        { error: `Jumlah pada item ${index + 1} tidak valid` },
        { status: 400 }
      );
    }

    const productOptions = activeOptionsByProduct(productId);
    const requiredTypes = ["ukuran", "bahan", "warna"];
    const selected = {};
    const chosenOptions = [];

    for (const type of requiredTypes) {
      const name = String(
        type === "ukuran" ? item?.size : type === "bahan" ? item?.material : item?.color
      ).trim();
      if (!name) {
        return NextResponse.json(
          { error: `Pilihan ${type} pada item ${index + 1} wajib diisi` },
          { status: 400 }
        );
      }
      const match = productOptions.find((o) => o.type === type && o.name === name);
      if (!match) {
        return NextResponse.json(
          { error: `Pilihan ${type} "${name}" pada item ${index + 1} tidak valid` },
          { status: 400 }
        );
      }
      selected[type] = match;
      chosenOptions.push(match);
    }

    const deltas = chosenOptions.map((o) => ({ price_delta: o.price_delta }));
    const line = calculateLine({
      basePrice: product.base_price,
      options: deltas,
      quantity: qty,
    });

    computedItems.push({
      productId,
      productName: product.name,
      basePrice: product.base_price,
      size: selected.ukuran.name,
      material: selected.bahan.name,
      color: selected.warna.name,
      options: chosenOptions.map((o) => ({
        id: o.id,
        type: o.type,
        name: o.name,
        price_delta: o.price_delta,
      })),
      customNote: (item?.customNote ?? item?.note ?? item?.custom_note ?? null)
        ? String(item?.customNote ?? item?.note ?? item?.custom_note).trim() || null
        : null,
      leadTimeDays: product.lead_time_days || 7,
      quantity: qty,
      unitPrice: line.unitPrice,
      lineTotal: line.lineTotal,
    });
  }

  if (!zone || !zone.is_active) {
    return NextResponse.json({ error: "Zona pengiriman tidak tersedia" }, { status: 400 });
  }
  if (zone.method !== data.shippingMethod) {
    return NextResponse.json({ error: "Zona tidak sesuai dengan cara pengiriman" }, { status: 400 });
  }

  const subtotal = subtotalOfLines(computedItems);
  const shippingFee = Math.max(0, Number(zone.fee) || 0);
  const total = totalOf(subtotal, shippingFee);

  if (total < 1) {
    return NextResponse.json({ error: "Total pesanan tidak valid" }, { status: 400 });
  }

  // 1. Simpan pesanan dulu untuk mendapatkan kode.
  let order;
  try {
    const { data: inserted, error: insertOrderError } = await supabase
      .from("orders")
      .insert({
        status: "menunggu_pembayaran",
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail,
        address: data.address,
        city: data.city,
        province: data.province,
        postal_code: data.postalCode || null,
        shipping_zone_id: zone.id,
        shipping_zone: zone.name,
        shipping_method: data.shippingMethod,
        courier: null,
        tracking_number: null,
        subtotal,
        shipping_fee: shippingFee,
        total,
        note: data.note || null,
      })
      .select("id, code, total")
      .single();
    if (insertOrderError || !inserted) throw insertOrderError || new Error("Gagal menyimpan pesanan");
    order = inserted;
  } catch (err) {
    console.error("[checkout] gagal menyimpan order:", err?.message);
    return NextResponse.json({ error: "Gagal menyimpan pesanan" }, { status: 500 });
  }

  // 2. Simpan item pesanan.
  try {
    const itemRows = computedItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      base_price: item.basePrice,
      size: item.size,
      material: item.material,
      color: item.color,
      options: item.options,
      custom_note: item.customNote,
      lead_time_days: item.leadTimeDays,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: item.lineTotal,
    }));
    const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
    if (itemsError) throw itemsError;
  } catch (err) {
    console.error("[checkout] gagal menyimpan item:", err?.message);
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Gagal menyimpan detail pesanan" }, { status: 500 });
  }

  // 3. Buat transaksi Snap.
  const leadTimes = computedItems.map((item) => item.leadTimeDays);
  const maxLead = leadTimes.length ? Math.max(...leadTimes) : 7;

  const itemDetails = [
    ...computedItems.map((item) => ({
      id: item.productId,
      price: item.unitPrice,
      quantity: item.quantity,
      name: `${item.productName} - ${item.size}/${item.material}/${item.color}`.slice(0, 50),
    })),
    ...(shippingFee > 0
      ? [
          {
            id: "ongkir",
            price: shippingFee,
            quantity: 1,
            name: `Ongkos kirim ${zone.name}`.slice(0, 50),
          },
        ]
      : []),
  ];

  let snap;
  try {
    snap = await createSnapTransaction({
      orderId: order.code,
      grossAmount: total,
      itemDetails,
      customer: {
        first_name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhoneNorm,
      },
    });
  } catch (err) {
    console.error("[checkout] gagal buat Snap:", err?.message);
    await supabase
      .from("orders")
      .update({ status: "dibatalkan" })
      .eq("id", order.id)
      .eq("status", "menunggu_pembayaran");
    return NextResponse.json({ error: "Gagal membuat transaksi pembayaran" }, { status: 502 });
  }

  // 4. Simpan token dan id Midtrans.
  await supabase
    .from("orders")
    .update({ snap_token: snap.token, midtrans_order_id: order.code })
    .eq("id", order.id);

  return NextResponse.json({
    ok: true,
    token: snap.token,
    orderCode: order.code,
    redirectUrl: snap.redirectUrl || null,
  });
}