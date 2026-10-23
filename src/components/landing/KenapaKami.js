import Image from "next/image";
import { productPhotoUrl } from "@/lib/storage";

export default function KenapaKami({ title, subtitle, items, imageUrl }) {
  const defaultItems = [
    {
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 17 17 3l4 4L7 21z" stroke="currentColor" strokeWidth="1.6" />
          <path d="m7 13 2 2M10 10l2 2M13 7l2 2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
      title: "Ukuran pas, minim retur",
      desc: "Panduan ukuran bergambar dan tabel ukuran per model. Data ukuran wajib lengkap sebelum pembayaran.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 12 12 20 4 12V4h8z" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="8.5" cy="8.5" r="1.3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
      title: "Harga transparan",
      desc: "Tambahan harga bahan dan ukuran terlihat langsung saat memilih. Ongkir jelas sebelum membayar.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
      title: "Estimasi selesai jelas",
      desc: "Lama pengerjaan tertera di tiap produk, dan perkiraan tanggal selesai muncul begitu pembayaran diterima.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12l4 4 10-10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 5v14h18" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
      title: "Pantau tanpa akun",
      desc: "Lihat progres dari dibayar, dijahit, sampai dikirim lewat kode pesanan. Tidak perlu daftar.",
    },
  ];

  const displayItems = items?.length ? items : defaultItems;
  const imageSrc = imageUrl ? productPhotoUrl(imageUrl) : null;

  return (
    <section id="kenapa" className="container section">
      {imageSrc && (
        <div className="mb-8 max-w-3xl mx-auto relative aspect-video">
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-2xl object-cover"
            style={{ objectPosition: "center" }}
          />
        </div>
      )}
      <h2 className="h-display h-section">{title}</h2>
      <p className="lead">{subtitle}</p>
      <div className="why">
        {displayItems.map((item, index) => (
          <div key={index} className="why-card">
            <div style={{ color: "#2F4A3A" }}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc || item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}