import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatRupiah } from "@/lib/format";
import { createShippingZone, updateShippingZone, deleteShippingZone } from "@/actions/shipping";

export default async function AdminShippingPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  const { data: zones } = await supabase
    .from("shipping_zones")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <section className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold">Tarif ongkos kirim (Pulau Jawa)</h1>

      <form action={createShippingZone} className="space-y-3 rounded-lg bg-putih p-4 ring-1 ring-garis">
        <h2 className="font-serif text-lg font-semibold">Tambah zona</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <label className="block">
            <span className="text-xs font-medium">Nama zona</span>
            <input name="name" required className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-medium">Metode</span>
            <select name="method" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm">
              <option value="kurir_darat">Kurir darat</option>
              <option value="antar_langsung">Antar langsung</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium">Tarif (Rp)</span>
            <input name="fee" type="number" min="0" required className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-medium">Urutan</span>
            <input name="sortOrder" type="number" defaultValue="0" className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="isActive" defaultChecked className="h-5 w-5" />
          Aktif
        </label>
        <button type="submit" className="inline-flex min-h-11 items-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover">
          Tambah zona
        </button>
      </form>

      <div className="space-y-3">
        {(zones || []).map((zone) => (
          <form key={zone.id} action={updateShippingZone} className="grid gap-2 rounded-lg bg-putih p-4 ring-1 ring-garis sm:grid-cols-6">
            <input type="hidden" name="id" value={zone.id} />
            <input name="name" defaultValue={zone.name} className="min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
            <select name="method" defaultValue={zone.method} className="min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm">
              <option value="kurir_darat">Kurir darat</option>
              <option value="antar_langsung">Antar langsung</option>
            </select>
            <input name="fee" type="number" min="0" defaultValue={zone.fee} className="min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
            <input name="sortOrder" type="number" defaultValue={zone.sort_order} className="min-h-11 rounded-lg border border-garis-input bg-putih px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-xs font-medium">
              <input type="checkbox" name="isActive" defaultChecked={zone.is_active} className="h-4 w-4" />
              Aktif
            </label>
            <div className="flex items-center gap-2">
              <button type="submit" className="rounded-lg bg-zaitun px-3 py-2 text-xs font-semibold text-krem hover:bg-zaitun-hover">
                Simpan
              </button>
              <button
                type="submit"
                formAction={deleteShippingZone}
                name="id"
                value={zone.id}
                className="rounded-lg bg-merah px-3 py-2 text-xs font-semibold text-krem hover:opacity-90"
              >
                Hapus
              </button>
            </div>
          </form>
        ))}
      </div>

      <p className="text-xs text-teks-sekunder">
        Tarif contoh (termasuk yang bertanda dummy) perlu diganti sebelum rilis.
      </p>
    </section>
  );
}