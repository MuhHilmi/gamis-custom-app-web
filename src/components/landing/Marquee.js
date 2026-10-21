"use client";

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-group">
          <span>Gamis custom</span>
          <span>✦</span>
          <span className="o">Ukuran pas</span>
          <span>✦</span>
          <span>Estimasi jelas</span>
          <span>✦</span>
          <span className="o">Kirim se-Jawa</span>
          <span>✦</span>
        </div>
        <div className="marquee-group">
          <span>Gamis custom</span>
          <span>✦</span>
          <span className="o">Ukuran pas</span>
          <span>✦</span>
          <span>Estimasi jelas</span>
          <span>✦</span>
          <span className="o">Kirim se-Jawa</span>
          <span>✦</span>
        </div>
      </div>
    </div>
  );
}