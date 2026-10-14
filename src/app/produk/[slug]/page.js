import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/lib/format";
import { productPhotoUrl } from "@/lib/storage";
import { createPublicClient } from "@/lib/supabase/public";
import CustomizationForm from "@/components/product/CustomizationForm";

const COLUMN_LABEL = {
  ukuran: "Ukuran",
  lingkar_dada_cm: "Lingkar dada (cm)",
  panjang_cm: "Panjang (cm)",
  panjang_lengan_cm: "Panjang lengan (cm)",
  lebar_bahu_cm: "Lebar bahu (cm)",
  lingkar_pinggul_cm: "Lingkar pinggul (cm)",
};

function prettyLabel(key) {
  return (
    COLUMN_LABEL[key] ||
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = createPublicClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) return { title: "Produk tidak ditemukan" };
  return {
    title: product.name,
    description: product.description || undefined,
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const supabase = createPublicClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, slug, name, description, material_info, base_price, photos, size_chart, lead_time_days, category_id"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (productError || !product) notFound();

  const { data: options } = await supabase
    .from("product_options")
    .select("id, type, name, price_delta, swatch_hex, sort_order")
    .eq("product_id", product.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const sizeChart = Array.isArray(product.size_chart) ? product.size_chart : [];
  const photosSource =
    Array.isArray(product.photos) && product.photos.length
      ? product.photos
      : ["/product-photos/Gamis.jpg"];
  const photos = photosSource.map((path) => productPhotoUrl(path) || path);

  return (
    <article className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <nav aria-label="Navigasi balik" className="mb-4">
        <Link href="/" className="inline-flex min-h-11 items-center text-sm font-medium text-zaitun hover:underline">
          ← Kembali ke katalog
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Galeri foto */}
        <section aria-labelledby="galeri-judul" className="min-w-0">
          <h2 id="galeri-judul" className="sr-only">Galeri foto</h2>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3">
            {photos.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden rounded-lg bg-krem-tua sm:w-[85%]"
              >
                <Image
                  src={src}
                  alt={`${product.name} - foto ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          {photos.length > 1 ? (
            <div className="flex justify-center gap-1.5" aria-hidden="true">
              {photos.map((_, index) => (
                <span
                  key={index}
                  className="h-1.5 w-1.5 rounded-full bg-garis"
                />
              ))}
            </div>
          ) : null}
        </section>

        {/* Informasi produk */}
        <section className="min-w-0">
          <h1 className="font-serif text-2xl font-semibold sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-2 text-xl font-bold tabular-nums text-zaitun">
            Mulai {formatRupiah(product.base_price)}
          </p>
          <p className="mt-1 text-sm text-teks-sekunder">
            Perkiraan pengerjaan {product.lead_time_days || 7} hari
          </p>

          {product.description ? (
            <div className="mt-5">
              <h2 className="font-serif text-lg font-semibold">Deskripsi</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          ) : null}

          {product.material_info ? (
            <div className="mt-4">
              <h2 className="font-serif text-lg font-semibold">Bahan dan perawatan</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                {product.material_info}
              </p>
            </div>
          ) : null}

          <div className="mt-6">
            <CustomizationForm product={product} options={options || []} />
          </div>
        </section>
      </div>

      {/* Tabel ukuran */}
      {sizeChart.length > 0 ? (
        <section className="mt-8" aria-labelledby="ukuran-judul">
          <h2 id="ukuran-judul" className="font-serif text-lg font-semibold sm:text-xl">
            Panduan ukuran
          </h2>
          <p className="mt-1 text-sm text-teks-sekunder">
            Ukuran dalam cm. Bila ragu, pilih yang lebih longgar.
          </p>
          <div className="mt-3 overflow-x-auto rounded-lg ring-1 ring-garis">
            <table className="min-w-full text-sm">
              <thead className="bg-krem-tua text-left">
                <tr>
                  {Object.keys(sizeChart[0]).map((key) => (
                    <th key={key} scope="col" className="px-3 py-2 font-semibold">
                      {prettyLabel(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeChart.map((row, index) => (
                  <tr key={index} className="border-t border-garis">
                    {Object.keys(sizeChart[0]).map((key) => (
                      <td key={key} className="px-3 py-2 tabular-nums">
                        {row?.[key] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </article>
  );
}
