import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";
import { productPhotoUrl } from "@/lib/storage";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, base_price, is_active, photos, lead_time_days")
    .order("created_at", { ascending: false });

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
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
          <table className="min-w-full text-sm">
            <thead className="bg-krem-tua text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Foto</th>
                <th className="px-3 py-2 font-semibold">Nama</th>
                <th className="px-3 py-2 font-semibold">Harga dasar</th>
                <th className="px-3 py-2 font-semibold">Pengerjaan</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Aksi</th>
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
                      <Link href={`/admin/produk/${product.id}`} className="text-zaitun hover:underline">
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