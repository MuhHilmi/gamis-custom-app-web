import { SITE_TAGLINE } from "@/lib/constants";

// Halaman sementara. Katalog (F1) dibangun di Tahap 2.
export default function Home() {
  return (
    <section className="bg-zaitun text-krem">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">{SITE_TAGLINE}</h1>
        <p className="mt-3 max-w-prose">
          Pilih ukuran, bahan, dan warna sendiri. Harga dan estimasi pengerjaan
          langsung terlihat sebelum membayar.
        </p>
        <p className="mt-6 inline-block rounded-lg bg-krem px-4 py-3 text-sm text-teks">
          Katalog segera hadir.
        </p>
      </div>
    </section>
  );
}
