import { SITE_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-group">
            <span>Gamis custom</span><span>✦</span><span className="o">Ukuran pas</span><span>✦</span><span>Estimasi jelas</span><span>✦</span><span className="o">Kirim se-Jawa</span><span>✦</span>
          </div>
          <div className="marquee-group">
            <span>Gamis custom</span><span>✦</span><span className="o">Ukuran pas</span><span>✦</span><span>Estimasi jelas</span><span>✦</span><span className="o">Kirim se-Jawa</span><span>✦</span>
          </div>
        </div>
      </div>

      <footer className="footer on-dark">
        <div className="container footer-in">
          <div className="footer-col brand">
            <p className="footer-logo">{SITE_NAME}</p>
            <p>Gamis pria dijahit sesuai ukuranmu, dikirim ke seluruh Pulau Jawa.</p>
          </div>
          <div className="footer-col" id="lacak">
            <h2>Bantuan</h2>
            <div className="footer-links">
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">Tanya admin lewat WhatsApp</a>
              <a href="/lacak">Lacak pesanan</a>
              <a href="#faq">Pertanyaan umum</a>
            </div>
          </div>
          <div className="footer-col">
            <h2>Kebijakan</h2>
            <div className="footer-links">
              <a href="#kebijakan-pengiriman">Kebijakan pengiriman</a>
              <a href="#kebijakan-pengembalian">Pembatalan dan pengembalian</a>
            </div>
          </div>
          <div className="footer-col">
            <h2>Pembayaran</h2>
            <p>Diproses aman lewat Midtrans. Metode pembayaran dipilih saat checkout.</p>
          </div>
        </div>
        <div className="footer-bar">
          <div className="container footer-bar-in">
            <p>© 2026 {SITE_NAME}. Seluruh hak dilindungi.</p>
            <div className="social">
              <a href="#instagram">Instagram</a>
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}