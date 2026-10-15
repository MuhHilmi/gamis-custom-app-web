// Webhook notifikasi pembayaran Midtrans.
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature, mapTransactionStatus, getTransactionStatus } from "@/lib/midtrans";
import { sendOrderConfirmationEmail } from "@/lib/email";


export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const orderId = payload?.order_id;
  const statusCode = payload?.status_code;
  const grossAmount = payload?.gross_amount;
  const signatureKey = payload?.signature_key;

  if (!verifyWebhookSignature({ orderId, statusCode, grossAmount, signatureKey })) {
    console.warn("[webhook] signature tidak cocok untuk", orderId);
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { data: order, error: findError } = await supabase
    .from("orders")
    .select("id, code, total, status, customer_email")
    .eq("midtrans_order_id", String(orderId))
    .maybeSingle();

  if (findError) {
    console.error("[webhook] gagal mencari pesanan:", findError.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (!order) {
    // Notifikasi uji atau order_id tidak dikenal: balas 200 agar tidak diulang.
    console.info("[webhook] order_id tidak dikenal:", orderId);
    return NextResponse.json({ ok: true });
  }

  // Cek gross_amount (angka, bukan string persis).
  const incomingAmount = Number(grossAmount);
  if (!Number.isFinite(incomingAmount) || Math.round(incomingAmount) !== Math.round(Number(order.total))) {
    console.warn("[webhook] gross_amount tidak cocok", orderId, grossAmount, order.total);
    return NextResponse.json({ ok: true });
  }

  const transactionStatus = payload?.transaction_status;
  const fraudStatus = payload?.fraud_status;

  // Anomali: pesanan sudah dibayar tapi menerima deny (transfer Permata/Mandiri/Indomaret).
  if (order.status === "dibayar" && transactionStatus === "deny") {
    console.warn("[webhook] anomali deny setelah settlement:", orderId);
    return NextResponse.json({ ok: true });
  }

  const mapped = mapTransactionStatus({ transaction_status: transactionStatus, status_code: statusCode, fraud_status: fraudStatus });
  if (!mapped) {
    // pending, authorize, refund, chargeback: dicatat, tidak diubah.
    return NextResponse.json({ ok: true });
  }

  // Hanya dari menunggu_pembayaran -> status baru.
  const updatePayload = { status: mapped };
  if (mapped === "dibayar" && payload?.payment_type) {
    updatePayload.payment_type = payload.payment_type;
  }

  const { data: updated, error: updateError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("midtrans_order_id", String(orderId))
    .eq("status", "menunggu_pembayaran")
    .select("code, status")
    .maybeSingle();

  if (updateError) {
    console.error("[webhook] gagal ubah status:", updateError.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (updated && mapped === "dibayar") {
    // Kegagalan email tidak membuat webhook gagal.
    await sendOrderConfirmationEmail({
      to: order.customer_email,
      orderCode: order.code,
      statusUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pesanan/${order.code}`,
    }).catch((err) => console.error("[webhook] email gagal:", err?.message));
  }

  return NextResponse.json({ ok: true });
}

// Cadangan manual: admin/pembeli memeriksa status via Status API.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");
  if (!orderId) return NextResponse.json({ ok: false }, { status: 400 });

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("code, midtrans_order_id, status, total")
    .or(`code.eq.${orderId},midtrans_order_id.eq.${orderId}`)
    .maybeSingle();

  if (!order) return NextResponse.json({ ok: false }, { status: 404 });

  try {
    const status = await getTransactionStatus(order.midtrans_order_id || order.code);
    const mapped = mapTransactionStatus(status);
    if (mapped) {
      await supabase
        .from("orders")
        .update({ status: mapped, ...(mapped === "dibayar" && status.payment_type ? { payment_type: status.payment_type } : {}) })
        .eq("id", order.id)
        .eq("status", "menunggu_pembayaran");
    }
    return NextResponse.json({ ok: true, status: mapped || order.status });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 502 });
  }
}