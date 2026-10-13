import CategoryFilter from "@/components/catalog/CategoryFilter";
import ProductCard from "@/components/catalog/ProductCard";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata = {
  title: "Katalog gamis pria custom",
};

export default async function Home({ searchParams }) {
  const params =
    typeof searchParams?.then === "function"
      ? await searchParams
      : searchParams || {};
  const categorySlug = params?.kategori ? String(params.kategori) : null;

  let categories = [];
  let products = [];
  let loadError = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createPublicClient();
      const [categoryResult, productResult] = await Promise.all([
        supabase
          .from("categories")
          .select("id, name, slug, sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("products")
          .select("id, slug, name, base_price, lead_time_days, photos, category_id")
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
      ]);

      if (categoryResult.error || productResult.error) {
        loadError = true;
      } else {
        categories = categoryResult.data || [];
        products = productResult.data || [];
      }
    } catch {
      loadError = true;
    }
  } else {
    loadError = true;
  }

  const selectedCategory = categorySlug
    ? categories.find((category) => category.slug === categorySlug) || null
    : null;
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory.id)
    : products;

  return (
    <>
      <section className="bg-zaitun text-krem">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <h1 className="font-serif text-3xl font-semibold sm:text-4xl">{SITE_TAGLINE}</h1>
          <p className="mt-3 max-w-prose text-sm sm:text-base">
            Pilih ukuran, bahan, dan warna sendiri. Harga dan estimasi pengerjaan
            langsung terlihat sebelum membayar.
          </p>
          <p className="mt-6 inline-block rounded-lg bg-krem px-4 py-3 text-sm font-medium text-teks">
            Katalog gamis pria custom {SITE_NAME}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5">
          <CategoryFilter categories={categories} activeSlug={categorySlug} />
        </div>

        {loadError ? (
          <div className="rounded-lg border border-garis bg-krem-tua p-6 text-sm text-teks">
            Katalog belum bisa dimuat. Periksa koneksi dan pengaturan Supabase.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-garis bg-krem-tua p-6 text-sm text-teks">
            {categorySlug
              ? "Belum ada produk di kategori ini."
              : "Belum ada produk yang tersedia."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}