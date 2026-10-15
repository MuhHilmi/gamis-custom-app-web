import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProduct } from "@/actions/products";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Tambah produk baru</h1>
      <form action={createProduct} className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
        <label className="block">
          <span className="text-sm font-medium">Nama produk</span>
          <input name="name" required className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Slug (opsional, diisi otomatis dari nama)</span>
          <input name="slug" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Kategori</span>
          <select name="categoryId" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm">
            <option value="">Tanpa kategori</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium">Deskripsi</span>
          <textarea name="description" rows={3} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Info bahan/perawatan</span>
          <textarea name="materialInfo" rows={3} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Harga dasar (Rp)</span>
          <input name="basePrice" type="number" min="0" required className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Lama pengerjaan (hari)</span>
          <input name="leadTimeDays" type="number" min="1" defaultValue={7} className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Foto (path, satu per baris)</span>
          <textarea name="photos" rows={3} className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Tabel ukuran (JSON array)</span>
          <textarea name="sizeChart" rows={4} placeholder='[{"ukuran":"M","lingkar_dada_cm":104}]' className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm font-mono" />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isActive" defaultChecked className="h-5 w-5" />
          Aktif
        </label>
        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover"
        >
          Simpan produk
        </button>
      </form>
    </section>
  );
}