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
  const allowedSorts = new Set(["code", "customer_name", "status", "total", "created_at"]);
  const sort = allowedSorts.has(params?.sort) ? params.sort : "created_at";
  const ascending = params?.dir === "asc";

  function sortHref(column) {
    const nextDir = sort === column && params?.dir === "asc" ? "desc" : "asc";
    const nextParams = new URLSearchParams();
    if (safeQ) nextParams.set("q", safeQ);
    nextParams.set("sort", column);
    nextParams.set("dir", nextDir);
    return `/admin/pesanan?${nextParams.toString()}`;
  }

  function sortIndicator(column) {
    if (sort !== column) return "";
    return params?.dir === "asc" ? " ↑" : " ↓";
  }

  let query = supabase
    .from("orders")
    .select("id, code, status, customer_name, customer_phone, city, province, total, created_at")
    .order(sort, { ascending })
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
        <form method="GET" action="/admin/pesanan" className="flex w-full gap-2 sm:w-auto">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari kode, nama, HP"
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm sm:flex-none"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover"
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
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-zaitun text-left text-krem">
              <tr>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("code")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Kode{sortIndicator("code")}
                  </Link>
                </th>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("customer_name")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Nama{sortIndicator("customer_name")}
                  </Link>
                </th>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("status")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Status{sortIndicator("status")}
                  </Link>
                </th>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("total")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Total{sortIndicator("total")}
                  </Link>
                </th>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("created_at")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Tanggal{sortIndicator("created_at")}
                  </Link>
                </th>
                <th className="px-3 py-2 text-krem font-semibold">Aksi</th>
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
                      className="inline-flex min-h-11 items-center rounded-lg bg-zaitun px-3 py-1.5 text-sm font-medium text-krem transition hover:bg-zaitun-hover focus-visible:outline-krem"
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