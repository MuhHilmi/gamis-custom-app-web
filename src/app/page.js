import Image from "next/image";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import CategoryFilter from "@/components/catalog/CategoryFilter";
import ProductCard from "@/components/catalog/ProductCard";
import Reveal from "@/components/motion/Reveal";
import Accordion from "@/components/landing/Accordion";
import { buildWaLink, productInquiryMessage } from "@/lib/whatsapp";
import { productPhotoUrl } from "@/lib/storage";
import {
  DEFAULT_LANDING_CONFIG,
  normalizeLandingConfig,
  landingSortToSupabase,
} from "@/lib/landing-config";

export async function generateMetadata() {
  let config = DEFAULT_LANDING_CONFIG;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "landing")
      .maybeSingle();
    config = normalizeLandingConfig(data?.value);
  } catch {
    // fallback default
  }
  return {
    title: config.seo.title,
    description: config.seo.description,
  };
}

export default async function LandingPage({ searchParams }) {
  const params =
    typeof searchParams?.then === "function" ? await searchParams : searchParams || {};
  const categorySlug = params?.kategori ? String(params.kategori) : null;

  let categories = [];
  let products = [];
  let landing = DEFAULT_LANDING_CONFIG;
  let loadError = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createPublicClient();
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "landing")
        .maybeSingle();
      landing = normalizeLandingConfig(settingsData?.value);

      const sort = landingSortToSupabase(landing.catalog.sort);
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
          .order(sort.column, { ascending: sort.ascending }),
      ]);
      if (categoryResult.error || productResult.error) {
        loadError = true;
      } else {
        categories = categoryResult.data || [];
        products = productResult.data || [];
      }
    } catch {
      loadError = true;
      landing = DEFAULT_LANDING_CONFIG;
    }
  } else {
    loadError = true;
  }

  const selectedCategory = categorySlug
    ? categories.find((c) => c.slug === categorySlug) || null
    : null;
  const filteredProductsSource = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory.id)
    : products;
  const filteredProducts = filteredProductsSource.slice(0, landing.catalog.limit);

  const waLink = buildWaLink(
    landing.contact.whatsappPhone,
    productInquiryMessage(landing.contact.message)
  );

  const faqs = [
    {
      q: "Bagaimana cara mengukur supaya pas?",
      a: "Setiap produk punya tabel ukuran, dan ada panduan bergambar. Data ukuran wajib terisi lengkap sebelum Anda bisa membayar.",
    },
    {
      q: "Berapa lama pengerjaannya?",
      a: "Sekitar 7–14 hari, tergantung model. Hitungan dimulai setelah pembayaran diterima, dan perkiraan tanggal selesai tampil di halaman status pesanan Anda.",
    },
    {
      q: "Apakah bisa kirim ke luar Pulau Jawa?",
      a: "Saat ini kami hanya mengirim ke Pulau Jawa, lewat antar langsung atau kurir darat. Ongkir mengikuti wilayah dan terlihat sebelum membayar.",
    },
    {
      q: "Bagaimana cara membayar?",
      a: "Pembayaran lewat Midtrans, jadi Anda memilih metode yang tersedia di jendela pembayaran. Data pembayaran tidak disimpan di toko kami.",
    },
    {
      q: "Kode pesanan saya hilang, bagaimana?",
      a: "Buka halaman Lacak pesanan, pilih “Lupa kode pesanan”, lalu isi email atau nomor HP. Kode dikirim ulang ke email yang Anda pakai saat checkout.",
    },
    {
      q: "Apakah pesanan bisa dibatalkan atau ditukar?",
      a: "Kebijakan pembatalan dan pengembalian barang custom mengikuti kebijakan toko; tanya admin via WhatsApp untuk detail.",
    },
  ];

  return (
    <>
      <section id="atas" className="bg-zaitun text-krem">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="fade-up h-[3px] w-14 bg-emas" />
              <h1
                className="fade-up mt-5 font-serif text-4xl font-bold leading-tight text-krem sm:text-5xl"
                style={{ "--fade-up-delay": "60ms" }}
              >
                {landing.hero.title}
              </h1>
              <p
                className="fade-up mt-4 max-w-prose text-base text-krem/90 sm:text-lg"
                style={{ "--fade-up-delay": "140ms" }}
              >
                {landing.hero.subtitle}
              </p>
              <div
                className="fade-up mt-7 flex flex-wrap gap-3"
                style={{ "--fade-up-delay": "220ms" }}
              >
                <Link
                  href={landing.hero.buttonHref}
                  className="group inline-flex min-h-12 items-center justify-center gap-1.5 rounded-lg bg-krem px-7 text-sm font-bold text-zaitun transition duration-300 hover:scale-[1.03] hover:bg-putih hover:shadow"
                >
                  {landing.hero.buttonText}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    <path d="M7 17 17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </Link>
                {landing.howToOrder.enabled ? (
                  <Link
                    href="#cara-pesan"
                    className="group inline-flex min-h-12 items-center justify-center gap-1.5 rounded-lg border-2 border-krem px-6 text-sm font-semibold text-krem transition duration-300 hover:scale-[1.03] hover:bg-zaitun-hover"
                  >
                    Lihat cara pesan
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M8 7h9v9" />
                    </svg>
                  </Link>
                ) : null}
              </div>
            </div>

            {landing.hero.images.some(Boolean) ? (
              <div
                className="fade-up grid grid-cols-5 gap-3"
                style={{ "--fade-up-delay": "160ms" }}
              >
                <div className="relative col-span-3 row-span-2 flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-krem-tua text-teks-sekunder">
                  {landing.hero.images[0] ? (
                    <Image
                      src={productPhotoUrl(landing.hero.images[0])}
                      alt={landing.hero.title}
                      fill
                      priority
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold">Foto: gamis tampak depan</span>
                  )}
                </div>
                <div className="relative col-span-2 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#D8CDB3] text-teks-sekunder">
                  {landing.hero.images[1] ? (
                    <Image
                      src={productPhotoUrl(landing.hero.images[1])}
                      alt={landing.hero.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold">Foto: detail kain</span>
                  )}
                </div>
                <div className="relative col-span-2 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#EFE7D3] text-teks-sekunder">
                  {landing.hero.images[2] ? (
                    <Image
                      src={productPhotoUrl(landing.hero.images[2])}
                      alt={landing.hero.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold">Foto: proses ukur</span>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="fade-up grid grid-cols-5 gap-3"
                style={{ "--fade-up-delay": "160ms" }}
              >
                <div className="col-span-3 row-span-2 flex aspect-[4/5] items-center justify-center rounded-2xl bg-krem-tua text-teks-sekunder">
                  <span className="text-sm font-semibold">Foto: gamis tampak depan</span>
                </div>
                <div className="col-span-2 flex aspect-square items-center justify-center rounded-2xl bg-[#D8CDB3] text-teks-sekunder">
                  <span className="text-xs font-semibold">Foto: detail kain</span>
                </div>
                <div className="col-span-2 flex aspect-square items-center justify-center rounded-2xl bg-[#EFE7D3] text-teks-sekunder">
                  <span className="text-xs font-semibold">Foto: proses ukur</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="koleksi" className="bg-krem">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
            {landing.catalog.title}
          </h2>
          {landing.catalog.showCategoryFilter ? (
            <CategoryFilter
              categories={categories}
              activeSlug={categorySlug}
              basePath="/"
            />
          ) : null}
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
              {filteredProducts.map((product, index) => (
                <Reveal
                  key={product.id}
                  delay={Math.min(index, 7) * 70}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="kenapa" className="bg-krem-tua">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="order-2 lg:order-1">
              {landing.why.imageUrl ? (
                <div className="relative aspect-[4/5] max-h-[520px] overflow-hidden rounded-2xl bg-[#D8CDB3]">
                  <Image
                    src={productPhotoUrl(landing.why.imageUrl)}
                    alt={landing.why.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/5] max-h-[520px] items-center justify-center rounded-2xl bg-[#D8CDB3] text-teks-sekunder">
                  <span className="text-sm font-semibold">Foto: proses menjahit</span>
                </div>
              )}
            </Reveal>
            <Reveal delay={120} className="order-1 lg:order-2">
              <div className="h-[3px] w-10 bg-emas" />
              <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">
                {landing.why.title}
              </h2>
              <p className="mt-2 text-teks-sekunder">
                {landing.why.subtitle}
              </p>
              <div className="mt-6">
                <Accordion
                  items={landing.why.items}
                  defaultOpenFirst
                  titleClassName="font-serif text-lg font-semibold"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {landing.howToOrder.enabled ? (
        <section id="cara-pesan" className="bg-krem">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
              {landing.howToOrder.title}
            </h2>
            <p className="mt-2 text-teks-sekunder">
              {landing.howToOrder.subtitle}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {landing.howToOrder.steps.map((step, index) => (
                <Reveal
                  key={step.n + step.t}
                  delay={index * 120}
                  className="h-full"
                >
                  <div className="h-full rounded-xl bg-putih p-5 ring-1 ring-garis">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zaitun text-sm font-bold text-krem">
                      {step.n}
                    </span>
                    <h3 className="mt-4 font-serif text-xl font-semibold">{step.t}</h3>
                    <p className="mt-2 text-sm text-teks-sekunder">{step.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section id="testimoni" className="bg-krem-tua">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="h-[3px] w-10 bg-emas" />
          <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">
            Kata pembeli
          </h2>
          <p className="mt-2 text-teks-sekunder">
            Cerita dari pembeli yang sudah memesan.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              "soal ukuran yang pas atau pengerjaan yang tepat waktu.",
              "soal bahan yang nyaman atau proses pemesanan yang mudah.",
              "soal pesanan untuk acara atau seragam.",
            ].map((note, index) => (
              <figure
                key={index}
                className="flex h-full flex-col rounded-xl bg-putih p-5 ring-1 ring-garis"
              >
                <blockquote className="text-sm text-teks">
                  [Tulis testimoni asli dari pembeli di sini, misalnya {note}]
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-krem-tua text-zaitun">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
                    </svg>
                  </span>
                  <span>
                    <span className="block font-semibold text-sm">[Nama pembeli]</span>
                    <span className="block text-xs text-teks-sekunder">
                      [Kota] · [Model yang dipesan]
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="bg-krem">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
            Pertanyaan yang sering diajukan
          </h2>
          <p className="mt-2 text-teks-sekunder">
            Belum menemukan jawabannya? Tanya admin lewat WhatsApp.
          </p>
          <Reveal className="mt-6">
            <Accordion
              items={faqs.map((faq) => ({ title: faq.q, text: faq.a }))}
              allowMultiple
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-zaitun text-krem">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-[3px] w-14 bg-emas" />
              <h2 className="mt-4 font-serif text-2xl font-bold sm:text-3xl">
                Siap punya gamis yang pas di badanmu?
              </h2>
              <p className="mt-2 text-krem/90">
                Pilih model, atur ukuran, dan lihat harganya langsung. Tidak perlu
                daftar akun.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#koleksi"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-krem px-7 text-sm font-bold text-zaitun hover:bg-putih"
              >
                Mulai pesan
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-krem px-6 text-sm font-semibold text-krem hover:bg-zaitun-hover"
              >
                Tanya lewat WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}