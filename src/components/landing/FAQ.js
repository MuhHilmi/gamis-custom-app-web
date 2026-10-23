export default function FAQ({ title, subtitle, items }) {
  const defaultItems = [
    {
      q: "Bagaimana cara mengukur supaya pas?",
      a: "Setiap produk punya tabel ukuran, dan ada panduan bergambar lewat tautan \"Cara mengukur\". Data ukuran wajib terisi lengkap sebelum kamu bisa membayar.",
    },
    {
      q: "Berapa lama pengerjaannya?",
      a: "Sekitar 7–14 hari, tergantung model. Hitungan dimulai setelah pembayaran diterima, dan perkiraan tanggal selesai tampil di halaman status pesananmu.",
    },
    {
      q: "Apakah bisa kirim ke luar Pulau Jawa?",
      a: "Saat ini kami hanya mengirim ke Pulau Jawa, lewat antar langsung atau kurir darat. Ongkir mengikuti wilayah dan terlihat sebelum membayar.",
    },
    {
      q: "Bagaimana cara membayar?",
      a: "Pembayaran lewat Midtrans, jadi kamu memilih metode yang tersedia di jendela pembayaran. Data pembayaranmu tidak disimpan di toko kami.",
    },
    {
      q: "Kode pesanan saya hilang, bagaimana?",
      a: "Buka halaman Lacak pesanan, pilih \"Lupa kode pesanan\", lalu isi email atau nomor HP. Kode dikirim ulang ke email yang kamu pakai saat checkout.",
    },
    {
      q: "Apakah pesanan bisa dibatalkan atau ditukar?",
      a: "Barang custom dibuat per pesanan, jadi pembatalan hanya bisa sebelum proses jahit dimulai. Untuk detail kebijakan, tanya admin lewat WhatsApp.",
    },
  ];

  const displayItems = items?.length ? items : defaultItems;

  return (
    <section id="faq" className="faq-wrap">
      <div className="container section">
        <div className="faq">
          <h2 className="h-display h-section">{title}</h2>
          <p className="lead">{subtitle}</p>
          <div className="faq-list">
            {displayItems.map((faq, index) => (
              <details key={index}>
                <summary>
                  {faq.q}
                  <span className="plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}