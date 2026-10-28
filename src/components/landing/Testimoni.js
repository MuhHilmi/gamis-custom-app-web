export default function Testimoni({ title, items }) {
  const defaultItems = [
    {
      title: "Ukuran pas banget",
      text: "Pertama kali pesan gamis online, takut gak pas. Ternyata tabel ukurannya detail banget, panduan ngukurnya jelas. Pas di badan, gak perlu alterasi.",
      author: "Budi S.",
      meta: "Jakarta · Gamis Harian Klasik",
    },
    {
      title: "Bahan nyaman, pengerjaan cepat",
      text: "Pesan buat acara nikah kakak. Bahan katun premium-nya adem, jahitan rapi. Dikirim sebelum estimasi. Recommended buat yang butuh gamis custom berkualitas.",
      author: "Ahmad R.",
      meta: "Bandung · Gamis Acara Premium",
    },
    {
      title: "Seragam kantor jadi rapi",
      text: "Pesan 5pcs buat tim. Prosesnya mudah, cukup kirim ukuran tiap orang. Harga grosir fair, kirimnya sekali paket. Tim puas, besok order lagi buat yang lain.",
      author: "Dewi L. (HR)",
      meta: "Surabaya · Gamis Seragam Kantor",
    },
  ];

  const displayItems = items?.length ? items : defaultItems;

  return (
    <section id="testimoni" className="container section">
      <h2 className="h-display h-section">{title}</h2>
      <div className="quotes">
        {displayItems.map((t, index) => {
          const initial = (t.author || "?").trim().charAt(0).toUpperCase();

          return (
            <figure key={index} className="quote">
              <span className="quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="t">{t.title}</p>
              <blockquote>{t.text}</blockquote>
              <figcaption>
                <span className="quote-avatar" aria-hidden="true">
                  {initial}
                </span>
                <span className="quote-author">
                  <strong>{t.author}</strong>
                  <span>{t.meta}</span>
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}