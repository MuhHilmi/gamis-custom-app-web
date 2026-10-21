export default function CaraPesan({ enabled, title, steps }) {
  if (!enabled) return null;

  const defaultSteps = [
    { num: "01", title: "Pilih", desc: "Pilih model gamis, lalu tentukan bahan dan warna yang kamu suka." },
    { num: "02", title: "Ukur", desc: "Isi ukuran dengan bantuan panduan bergambar. Data ukuran wajib lengkap sebelum bayar." },
    { num: "03", title: "Bayar", desc: "Bayar lewat metode yang biasa kamu pakai. Kode pesanan dikirim ke email, progres bisa dipantau kapan saja." },
  ];

  const displaySteps = steps?.length ? steps : defaultSteps;

  return (
    <section id="cara-pesan" className="steps-wrap">
      <div className="container section">
        <h2 className="h-display h-section">{title}</h2>
        <div className="steps">
          {displaySteps.map((step) => (
            <div key={step.num} className="step">
              <div className="num" aria-hidden="true">
                {step.num}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}