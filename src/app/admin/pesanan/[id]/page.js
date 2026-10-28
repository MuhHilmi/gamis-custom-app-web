import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import { ADMIN_TRANSITIONS, ORDER_STATUS_LABEL } from "@/lib/constants";
import UpdateOrderForm from "@/components/admin/UpdateOrderForm";
import { buildAdminLink, orderStatusMessage } from "@/lib/whatsapp";
import CheckPaymentButton from "@/components/order/CheckPaymentButton";

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  const allowedNext = ADMIN_TRANSITIONS[order.status] || [];

  const waMessage = orderStatusMessage({
    orderCode: order.code,
    status: ORDER_STATUS_LABEL[order.status],
    courier: order.courier,
    trackingNumber: order.tracking_number,
  });
  const waLink = buildAdminLink(waMessage);

  return (
    <article className="space-y-6">
      <nav>
        <Link href="/admin/pesanan" className="inline-flex min-h-11 items-center text-sm font-medium text-zaitun hover:underline">
          ← Kembali ke daftar
        </Link>
      </nav>

      <header className="space-y-2">
        <h1 className="font-serif text-2xl font-semibold">Pesanan {order.code}</h1>
        <p className="text-sm text-teks-sekunder">
          Dibuat {formatTanggalWaktu(order.created_at)}
        </p>
        <p className="inline-flex rounded-full bg-zaitun-muda px-3 py-1 text-sm font-medium text-zaitun">
          {ORDER_STATUS_LABEL[order.status] || order.status}
        </p>
        {order.status === "menunggu_pembayaran" ? (
          <div className="pt-2">
            <CheckPaymentButton orderCode={order.code} />
          </div>
        ) : null}
      </header>

      {/* Detail penerima */}
      <section className="rounded-lg bg-putih p-4 ring-1 ring-garis">
        <h2 className="font-serif text-lg font-semibold">Data penerima</h2>
        <dl className="mt-3 space-y-3 text-sm break-words">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="text-teks-sekunder sm:w-32">Nama</dt>
            <dd>{order.customer_name}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="text-teks-sekunder sm:w-32">Nomor HP</dt>
            <dd className="font-mono">{order.customer_phone}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="text-teks-sekunder sm:w-32">Email</dt>
            <dd>{order.customer_email}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="text-teks-sekunder sm:w-32">Alamat</dt>
            <dd>{order.address}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="text-teks-sekunder sm:w-32">Kota/Provinsi</dt>
            <dd>
              {order.city}, {order.province} {order.postal_code ? `(${order.postal_code})` : ""}
            </dd>
          </div>
        </dl>
      </section>

      {/* Items */}
      <section className="space-y-3">
        <h2 className="font-serif text-lg font-semibold">Item kustomisasi</h2>
        {(items || []).map((item) => (
          <div key={item.id} className="rounded-lg bg-putih p-4 ring-1 ring-garis">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif font-semibold">{item.product_name}</h3>
              <span className="font-bold tabular-nums text-zaitun">
                {formatRupiah(item.line_total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-teks-sekunder">
              {item.size} · {item.material} · {item.color}
            </p>
            {item.custom_note ? (
              <p className="mt-1 text-xs italic text-teks-sekunder">
                Catatan: {item.custom_note}
              </p>
            ) : null}
            <p className="mt-2 text-xs text-teks-sekunder">
              {item.quantity} pcs × {formatRupiah(item.unit_price)} (dasar {formatRupiah(item.base_price)})
            </p>
          </div>
        ))}
      </section>

      {/* Biaya */}
      <section className="rounded-lg bg-putih p-4 ring-1 ring-garis">
        <h2 className="font-serif text-lg font-semibold">Biaya</h2>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Ongkir ({order.shipping_zone})</span>
            <span className="tabular-nums">{formatRupiah(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between border-t border-garis pt-2 font-semibold">
            <span>Total</span>
            <span className="tabular-nums text-zaitun">{formatRupiah(order.total)}</span>
          </div>
          {order.estimated_ready_at ? (
            <div className="flex justify-between">
              <span>Estimasi siap</span>
              <span>{formatTanggalWaktu(order.estimated_ready_at)}</span>
            </div>
          ) : null}
        </div>
      </section>

      {/* Ubah status & resi */}
      <UpdateOrderForm order={order} allowedNext={allowedNext} />

      {/* WhatsApp */}
      <section className="rounded-lg bg-putih p-4 ring-1 ring-garis">
        <h2 className="font-serif text-lg font-semibold">Hubungi pembeli</h2>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center justify-center rounded-lg bg-ok px-4 text-sm font-semibold text-krem hover:opacity-90"
        >
          Kirim kabar via WhatsApp
        </a>
      </section>
    </article>
  );
}