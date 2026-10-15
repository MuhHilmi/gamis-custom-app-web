import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah, formatTanggal } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/constants";

export default async function AdminOrdersPage({ searchParams }) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  const params = typeof searchParams?.then === "function" ? await searchParams : searchParams || {};
  const q = params?.q ? String(params.q).trim() : "";
  const safeQ = q.replace(/[,%()]/g, "");

  let query = supabase
    .from("orders")
    .select("id, code, status, customer_name, customer_phone, city, province, total, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (safeQ) {
    query = query.or(
      `code.ilike.%${safeQ}%,customer_name.ilike.%${safeQ}%,customer_phone.ilike.%${safeQ}%`
    );
  }

  const { data: orders, error } = await query;
  if (error) {
    console.error("[admin] gagal memuat pesanan:", error.message);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-semibold">Pesanan masuk</h1>
        <form method="GET" action="/admin/pesanan" className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari kode, nama, HP"
            className="min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 items-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover"
          >
            Cari
          </button>
        </form>
      </div>

      {(!orders || orders.length === 0) ? (
        <p className="rounded-lg border border-garis bg-krem-tua p-6 text-sm text-teks">
          Belum ada pesanan.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-garis">
          <table className="min-w-full text-sm">
            <thead className="bg-krem-tua text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Kode</th>
                <th className="px-3 py-2 font-semibold">Nama</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Total</th>
                <th className="px-3 py-2 font-semibold">Tanggal</th>
                <th className="px-3 py-2 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-garis">
                  <td className="px-3 py-2 font-mono">{order.code}</td>
                  <td className="px-3 py-2">
                    {order.customer_name}
                    <br />
                    <span className="text-xs text-teks-sekunder">{order.customer_phone}</span>
                  </td>
                  <td className="px-3 py-2">
                    {ORDER_STATUS_LABEL[order.status] || order.status}
                  </td>
                  <td className="px-3 py-2 tabular-nums">{formatRupiah(order.total)}</td>
                  <td className="px-3 py-2 text-xs">{formatTanggal(order.created_at)}</td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/admin/pesanan/${order.id}`}
                      className="text-zaitun hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}