import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import CategoryFilter from "@/components/catalog/CategoryFilter";
import ProductCard from "@/components/catalog/ProductCard";
import { SITE_TAGLINE } from "@/lib/constants";
import { buildAdminLink, productInquiryMessage } from "@/lib/whatsapp";

export const metadata = {
  title: "Gamis Custom - Gamis Pria Dijahit Sesuai Ukuranmu",
  description:
    "Pesan gamis pria custom: pilih ukuran, bahan, dan warna sendiri. Harga dan estimasi pengerjaan langsung terlihat.",
};

export default async function LandingPage({ searchParams }) {
  const params =
    typeof searchParams?.then === "function" ? await searchParams : searchParams || {};
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
    ? categories.find((c) => c.slug === categorySlug) || null
    : null;
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory.id)
    : products;

  const waLink = buildAdminLink(productInquiryMessage("gamis custom"));

  const whyItems = [
    {
      title: "Ukuran pas, minim retur",
      text: "Panduan ukuran bergambar dan tabel ukuran per model. Data ukuran wajib lengkap sebelum pembayaran.",
    },
    {
      title: "Harga transparan",
      text: "Tambahan harga bahan dan ukuran terlihat langsung saat memilih. Ongkir jelas sebelum Anda membayar.",
    },
    {
      title: "Estimasi selesai yang jelas",
      text: "Lama pengerjaan tertera di tiap produk, dan perkiraan tanggal selesai muncul begitu pembayaran diterima.",
    },
    {
      title: "Pantau tanpa akun",
      text: "Lihat progres dari dibayar, dijahit, sampai dikirim lewat kode pesanan. Tidak perlu daftar.",
    },
  ];

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
              <div className="h-[3px] w-14 bg-emas" />
              <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-krem sm:text-5xl">
                Gamis pria dijahit sesuai ukuranmu
              </h1>
              <p className="mt-4 max-w-prose text-base text-krem/90 sm:text-lg">
                Pilih bahan dan warna, lihat harga langsung berubah, dan ketahui
                perkiraan selesai sebelum membayar. Pengerjaan sekitar 7–14 hari.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#koleksi"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-krem px-7 text-sm font-bold text-zaitun hover:bg-putih"
                >
                  Lihat koleksi
                </Link>
                <Link
                  href="#cara-pesan"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border-2 border-krem px-6 text-sm font-semibold text-krem hover:bg-zaitun-hover"
                >
                  Lihat cara pesan
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
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
          </div>
        </div>
      </section>

      <section id="koleksi" className="bg-krem">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
              Koleksi gamis
            </h2>
            <CategoryFilter
              categories={categories}
              activeSlug={categorySlug}
              basePath="/"
            />
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
        </div>
      </section>

      <section id="kenapa" className="bg-krem-tua">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <div className="flex aspect-[4/5] max-h-[520px] items-center justify-center rounded-2xl bg-[#D8CDB3] text-teks-sekunder">
                <span className="text-sm font-semibold">Foto: proses menjahit</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="h-[3px] w-10 bg-emas" />
              <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl">
                Kenapa pilih kami
              </h2>
              <p className="mt-2 text-teks-sekunder">
                Memesan gamis custom seharusnya jelas dari awal sampai barang tiba.
              </p>
              <div className="mt-6 space-y-3">
                {whyItems.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl bg-putih p-4 ring-1 ring-garis"
                  >
                    <h3 className="font-serif text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-teks-sekunder">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cara-pesan" className="bg-krem">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Cara pesan</h2>
          <p className="mt-2 text-teks-sekunder">
            Tiga langkah, tanpa perlu membuat akun.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                n: "1",
                t: "Pilih",
                d: "Pilih model gamis, lalu tentukan bahan dan warna yang Anda suka.",
              },
              {
                n: "2",
                t: "Ukur",
                d: "Isi ukuran dengan bantuan panduan bergambar. Data ukuran wajib lengkap sebelum bayar.",
              },
              {
                n: "3",
                t: "Bayar",
                d: "Bayar lewat metode yang biasa Anda pakai. Kode pesanan dikirim ke email, progres bisa dipantau kapan saja.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-xl bg-putih p-5 ring-1 ring-garis"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zaitun text-sm font-bold text-krem">
                  {step.n}
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold">{step.t}</h3>
                <p className="mt-2 text-sm text-teks-sekunder">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
          <div className="mt-6 divide-y divide-garis border-y border-garis">
            {faqs.map((faq) => (
              <details key={faq.q} className="py-2">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-2 text-base font-semibold">
                  {faq.q}
                  <span className="text-xl text-zaitun" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-4 text-sm text-teks-sekunder">{faq.a}</p>
              </details>
            ))}
          </div>
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