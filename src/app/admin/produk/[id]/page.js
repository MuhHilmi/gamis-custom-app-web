import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProduct, addOption, updateOption, deleteOption } from "@/actions/products";
import { productPhotoUrl } from "@/lib/storage";
import PhotoUploader from "@/components/admin/PhotoUploader";

const TYPES = ["ukuran", "bahan", "warna"];

export default async function EditProductPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  const [{ data: product }, { data: categories }, { data: options }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("id, name").eq("is_active", true).order("sort_order", { ascending: true }),
    supabase.from("product_options").select("*").eq("product_id", id).order("type").order("sort_order"),
  ]);

  if (!product) notFound();

  return (
    <section className="space-y-8">
      <nav>
        <Link href="/admin/produk" className="text-sm font-medium text-zaitun hover:underline">
          ← Kembali ke daftar produk
        </Link>
      </nav>

      <h1 className="font-serif text-2xl font-semibold">Edit produk: {product.name}</h1>

      {/* Edit produk */}
      <form action={updateProduct} className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
        <input type="hidden" name="id" value={product.id} />
        <label className="block">
          <span className="text-sm font-medium">Nama</span>
          <input name="name" defaultValue={product.name} required className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Slug</span>
          <input name="slug" defaultValue={product.slug} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Kategori</span>
          <select name="categoryId" defaultValue={product.category_id || ""} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm">
            <option value="">Tanpa kategori</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Deskripsi</span>
          <textarea name="description" defaultValue={product.description || ""} rows={3} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Info bahan/perawatan</span>
          <textarea name="materialInfo" defaultValue={product.material_info || ""} rows={3} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Harga dasar (Rp)</span>
          <input name="basePrice" type="number" min="0" defaultValue={product.base_price} required className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Lama pengerjaan (hari)</span>
          <input name="leadTimeDays" type="number" min="1" defaultValue={product.lead_time_days || 7} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Foto (path, satu per baris)</span>
          <textarea name="photos" defaultValue={(product.photos || []).join("\n")} rows={4} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <PhotoUploader productId={product.id} />
        <label className="block">
          <span className="text-sm font-medium">Tabel ukuran (JSON array)</span>
          <textarea name="sizeChart" defaultValue={product.size_chart ? JSON.stringify(product.size_chart, null, 2) : ""} rows={6} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm font-mono" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isActive" defaultChecked={product.is_active} className="h-5 w-5" />
          Aktif
        </label>
        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover"
        >
          Simpan perubahan
        </button>
      </form>

      {/* Galeri kecil */}
      {Array.isArray(product.photos) && product.photos.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {product.photos.map((path, index) => {
            const url = productPhotoUrl(path);
            return url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`${path}-${index}`} src={url} alt="foto produk" className="h-20 w-16 rounded object-cover" />
            ) : null;
          })}
        </div>
      ) : null}

      {/* Opsi */}
      <section className="space-y-6">
        <h2 className="font-serif text-xl font-semibold">Opsi kustomisasi</h2>

        {/* Form tambah opsi */}
        <form action={addOption} className="space-y-3 rounded-lg bg-krem-tua p-4">
          <input type="hidden" name="productId" value={product.id} />
          <div className="grid gap-3 sm:grid-cols-4">
            <label className="block">
              <span className="text-xs font-medium">Tipe</span>
              <select name="type" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm">
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium">Nama</span>
              <input name="name" required className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Tambahan harga</span>
              <input name="priceDelta" type="number" min="0" defaultValue="0" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Swatch (warna)</span>
              <input name="swatchHex" placeholder="#2f4a3a" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium">
              Urutan
              <input name="sortOrder" type="number" defaultValue="0" className="ml-2 w-20 rounded-lg border border-garis-input bg-putih px-2 py-1 text-sm" />
            </label>
            <label className="flex items-center gap-2 text-xs font-medium">
              <input type="checkbox" name="isActive" defaultChecked className="h-4 w-4" />
              Aktif
            </label>
            <button
              type="submit"
              className="ml-auto inline-flex min-h-11 items-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover"
            >
              Tambah opsi
            </button>
          </div>
        </form>

        {/* Daftar opsi */}
        {TYPES.map((type) => {
          const typeOptions = (options || []).filter((o) => o.type === type);
          if (typeOptions.length === 0) return null;
          return (
            <div key={type} className="space-y-3">
              <h3 className="font-serif text-lg font-semibold capitalize">{type}</h3>
              {typeOptions.map((option) => (
                <form
                  key={option.id}
                  action={updateOption}
                  className="grid gap-2 rounded-lg bg-putih p-3 ring-1 ring-garis sm:grid-cols-6"
                >
                  <input type="hidden" name="id" value={option.id} />
                  <input type="hidden" name="productId" value={product.id} />
                  <select name="type" defaultValue={option.type} className="min-h-11 rounded-lg border border-garis-input bg-putih px-2 py-1 text-sm">
                    {TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input name="name" defaultValue={option.name} required className="min-h-11 rounded-lg border border-garis-input bg-putih px-2 py-1 text-sm" />
                  <input name="priceDelta" type="number" min="0" defaultValue={option.price_delta} className="min-h-11 rounded-lg border border-garis-input bg-putih px-2 py-1 text-sm" />
                  <input name="swatchHex" defaultValue={option.swatch_hex || ""} className="min-h-11 rounded-lg border border-garis-input bg-putih px-2 py-1 text-sm" />
                  <input name="sortOrder" type="number" defaultValue={option.sort_order} className="min-h-11 rounded-lg border border-garis-input bg-putih px-2 py-1 text-sm" />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs">
                      <input type="checkbox" name="isActive" defaultChecked={option.is_active} className="h-4 w-4" />
                      Aktif
                    </label>
                    <button
                      type="submit"
                      className="rounded-lg bg-zaitun px-3 py-2 text-xs font-semibold text-krem hover:bg-zaitun-hover"
                    >
                      Simpan
                    </button>
                    <button
                      type="submit"
                      formAction={deleteOption}
                      name="id"
                      value={option.id}
                      className="rounded-lg bg-merah px-3 py-2 text-xs font-semibold text-krem hover:opacity-90"
                    >
                      Hapus
                    </button>
                    <input type="hidden" name="productId" value={product.id} />
                  </div>
                </form>
              ))}
            </div>
          );
        })}
      </section>
    </section>
  );
}