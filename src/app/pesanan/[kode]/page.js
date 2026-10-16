import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRupiah, formatTanggalWaktu } from "@/lib/format";
import CheckPaymentButton from "@/components/order/CheckPaymentButton";
import {
  ORDER_STATUS_LABEL,
  ORDER_TIMELINE,
} from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import PayNowButton from "@/components/order/PayNowButton";

export async function generateMetadata({ params }) {
  const { kode } = await params;
  return { title: `Pesanan ${kode}` };
}

const STATUS_CORE = [
  "menunggu_pembayaran",
  "dibayar",
  "diproses",
  "dikerjakan",
  "dikirim",
  "selesai",
];

function StatusBadge({ status }) {
  return (
    <span className="inline-flex rounded-full bg-zaitun-muda px-3 py-1 text-sm font-medium text-zaitun">
      {ORDER_STATUS_LABEL[status] || status}
    </span>
  );
}

export default async function OrderStatusPage({ params }) {
  const { kode } = await params;

  let order = null;
  let items = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("orders")
      .select(
        "id, code, status, customer_name, city, province, subtotal, shipping_fee, total, shipping_zone, shipping_method, courier, tracking_number, estimated_ready_at, paid_at, snap_token, note, created_at"
      )
      .eq("code", kode)
      .maybeSingle();
    order = data || null;
    if (order) {
      const { data: rows } = await supabase
        .from("order_items")
        .select(
          "id, product_name, size, material, color, custom_note, quantity, unit_price, line_total, lead_time_days"
        )
        .eq("order_id", order.id)
        .order("created_at", { ascending: true });
      items = rows || [];
    }
  } catch {
    order = null;
  }

  if (!order) notFound();

  const currentIndex = STATUS_CORE.indexOf(order.status);
  const isCancelled = order.status === "dibatalkan" || order.status === "kedaluwarsa";

  return (
    <article className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <nav className="mb-4">
        <Link
          href="/katalog"
          className="inline-flex min-h-11 items-center text-sm font-medium text-zaitun hover:underline"
        >
          ← Kembali ke katalog
        </Link>
      </nav>

      <header className="space-y-3">
        <h1 className="font-serif text-2xl font-semibold">Status pesanan</h1>
        <p className="font-mono text-lg font-bold tabular-nums">{order.code}</p>
        <StatusBadge status={order.status} />
        {order.status === "menunggu_pembayaran" ? (
          <div className="mt-4 space-y-3">
            <PayNowButton token={order.snap_token} orderCode={order.code} />
            <div>
              <p className="mb-2 text-xs text-teks-sekunder">
                Jika pembayaran sudah berhasil tetapi status belum berubah, periksa
                kembali:
              </p>
              <CheckPaymentButton orderCode={order.code} />
            </div>
          </div>
        ) : null}
      </header>

      {/* Linimasa */}
      <section className="mt-8" aria-labelledby="linimasa-judul">
        <h2 id="linimasa-judul" className="font-serif text-lg font-semibold">
          Linimasa
        </h2>
        <ol className="mt-3 space-y-3">
          {STATUS_CORE.map((status, index) => {
            const done = !isCancelled && currentIndex >= index;
            const current = !isCancelled && currentIndex === index;
            return (
              <li key={status} className="flex items-center gap-3">
                <span
                  className={
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                    (done
                      ? "bg-zaitun text-krem"
                      : "bg-krem-tua text-teks-sekunder")
                  }
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <span
                  className={
                    "text-sm " +
                    (current ? "font-semibold text-teks" : "text-teks-sekunder")
                  }
                >
                  {ORDER_STATUS_LABEL[status]}
                </span>
              </li>
            );
          })}
        </ol>
        {isCancelled ? (
          <p className="mt-4 rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah">
            Pesanan ini {ORDER_STATUS_LABEL[order.status].toLowerCase()}.
          </p>
        ) : null}
      </section>

      {/* Detail kustomisasi */}
      <section className="mt-8" aria-labelledby="detail-judul">
        <h2 id="detail-judul" className="font-serif text-lg font-semibold">
          Detail pesanan
        </h2>
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg bg-putih p-4 ring-1 ring-garis">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-base font-semibold">{item.product_name}</h3>
                <span className="text-sm font-bold tabular-nums text-zaitun">
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
                {item.quantity} pcs × {formatRupiah(item.unit_price)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Ringkasan */}
      <section className="mt-8" aria-labelledby="ringkasan-judul">
        <h2 id="ringkasan-judul" className="font-serif text-lg font-semibold">
          Ringkasan biaya
        </h2>
        <div className="mt-3 space-y-2 rounded-lg bg-putih p-4 ring-1 ring-garis text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-teks-sekunder">Subtotal</span>
            <span className="tabular-nums">{formatRupiah(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-teks-sekunder">
              Ongkos kirim ({order.shipping_zone})
            </span>
            <span className="tabular-nums">{formatRupiah(order.shipping_fee)}</span>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-garis pt-3">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold tabular-nums text-zaitun">
              {formatRupiah(order.total)}
            </span>
          </div>
        </div>
      </section>

      {/* Estimasi dan pengiriman */}
      <section className="mt-8" aria-labelledby="logistik-judul">
        <h2 id="logistik-judul" className="font-serif text-lg font-semibold">
          Pengiriman
        </h2>
        <div className="mt-3 space-y-2 rounded-lg bg-putih p-4 ring-1 ring-garis text-sm">
          <p>
            <span className="text-teks-sekunder">Penerima:</span>{" "}
            {order.customer_name}
          </p>
          <p>
            <span className="text-teks-sekunder">Tujuan:</span> {order.city},{" "}
            {order.province}
          </p>
          <p>
            <span className="text-teks-sekunder">Metode:</span>{" "}
            {order.shipping_method === "antar_langsung"
              ? "Antar langsung"
              : "Kurir darat"}
          </p>
          {order.courier ? (
            <p>
              <span className="text-teks-sekunder">Kurir:</span> {order.courier}
            </p>
          ) : null}
          {order.tracking_number ? (
            <p>
              <span className="text-teks-sekunder">Resi:</span>{" "}
              <span className="font-mono">{order.tracking_number}</span>
            </p>
          ) : null}
          {order.estimated_ready_at ? (
            <p>
              <span className="text-teks-sekunder">Perkiraan siap:</span>{" "}
              {formatTanggalWaktu(order.estimated_ready_at)}
            </p>
          ) : null}
          {order.paid_at ? (
            <p>
              <span className="text-teks-sekunder">Dibayar:</span>{" "}
              {formatTanggalWaktu(order.paid_at)}
            </p>
          ) : null}
          {order.note ? (
            <p>
              <span className="text-teks-sekunder">Catatan pesanan:</span>{" "}
              {order.note}
            </p>
          ) : null}
        </div>
      </section>
    </article>
  );
}