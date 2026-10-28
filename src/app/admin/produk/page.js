import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";
import { productPhotoUrl } from "@/lib/storage";

export default async function AdminProductsPage({ searchParams }) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  const params = typeof searchParams?.then === "function" ? await searchParams : searchParams || {};
  const allowedSorts = new Set(["name", "base_price", "lead_time_days", "is_active", "created_at"]);
  const sort = allowedSorts.has(params?.sort) ? params.sort : "created_at";
  const ascending = params?.dir === "asc";

  function sortHref(column) {
    const nextDir = sort === column && params?.dir === "asc" ? "desc" : "asc";
    return `/admin/produk?sort=${encodeURIComponent(column)}&dir=${nextDir}`;
  }

  function sortIndicator(column) {
    if (sort !== column) return "";
    return params?.dir === "asc" ? " ↑" : " ↓";
  }

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, base_price, is_active, photos, lead_time_days")
    .order(sort, { ascending });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl font-semibold">Produk</h1>
        <Link
          href="/admin/produk/baru"
          className="inline-flex min-h-11 items-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover"
        >
          Tambah produk
        </Link>
      </div>

      {(!products || products.length === 0) ? (
        <p className="rounded-lg border border-garis bg-krem-tua p-6 text-sm text-teks">
          Belum ada produk.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg ring-1 ring-garis">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-zaitun text-left text-krem">
              <tr>
                <th className="px-3 py-2 text-krem font-semibold">Foto</th>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("name")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Nama{sortIndicator("name")}
                  </Link>
                </th>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("base_price")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Harga dasar{sortIndicator("base_price")}
                  </Link>
                </th>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("lead_time_days")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Pengerjaan{sortIndicator("lead_time_days")}
                  </Link>
                </th>
                <th className="px-3 py-2 font-semibold">
                  <Link href={sortHref("is_active")} className="inline-flex items-center gap-1 text-krem hover:text-krem hover:underline">
                    Status{sortIndicator("is_active")}
                  </Link>
                </th>
                <th className="px-3 py-2 text-krem font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const photo = productPhotoUrl(product.photos?.[0]);
                return (
                  <tr key={product.id} className="border-t border-garis">
                    <td className="px-3 py-2">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt={product.name} className="h-12 w-10 rounded object-cover" />
                      ) : (
                        <span className="text-xs text-teks-sekunder">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{product.name}</td>
                    <td className="px-3 py-2 tabular-nums">{formatRupiah(product.base_price)}</td>
                    <td className="px-3 py-2">{product.lead_time_days || 7} hari</td>
                    <td className="px-3 py-2">
                      {product.is_active ? "Aktif" : "Nonaktif"}
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/admin/produk/${product.id}`}
                        className="inline-flex min-h-11 items-center rounded-lg bg-zaitun px-3 py-1.5 text-sm font-medium text-krem transition hover:bg-zaitun-hover focus-visible:outline-krem"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}