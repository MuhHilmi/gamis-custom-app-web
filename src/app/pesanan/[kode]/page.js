import Link from "next/link";

export const metadata = {
  title: "Status pesanan",
};

export default async function OrderStatusPage({ params }) {
  const { kode } = await params;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
      <h1 className="font-serif text-2xl font-semibold">Pesanan diterima</h1>
      <p className="mt-4 text-sm text-teks-sekunder">
        Kode pesanan Anda:
      </p>
      <p className="mt-2 font-mono text-xl font-bold tabular-nums text-zaitun">{kode}</p>
      <p className="mt-4 text-sm text-teks-sekunder">
        Simpan kode ini untuk memantau status pesanan. Detail lengkap dan
        linimasa perubahan status akan tampil di sini pada tahap F7/F12.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-zaitun px-5 text-sm font-semibold text-krem hover:bg-zaitun-hover"
        >
          Kembali ke katalog
        </Link>
      </div>
    </section>
  );
}