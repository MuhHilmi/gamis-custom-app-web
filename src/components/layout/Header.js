import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import CartNavLink from "@/components/layout/CartNavLink";

export default function Header() {
  return (
    <>
      <div className="topbar">Pengerjaan 7–14 hari · Kirim ke seluruh Pulau Jawa</div>
      <header>
        <div className="container header-in">
          <a className="logo" href="#atas">{SITE_NAME}</a>
          <nav className="nav" aria-label="Navigasi utama">
            <a href="#atas">Beranda</a>
            <a href="#pilih-model">Koleksi</a>
            <a href="#cara-pesan">Cara pesan</a>
            <a href="#faq">FAQ</a>
            <a href="/lacak" className="cart" aria-label="Lacak pesanan">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 4h2l2.2 11h10.6L20 7H6.2" />
                <circle cx="9" cy="19.5" r="1.4" />
                <circle cx="17" cy="19.5" r="1.4" />
              </svg>
              <span>Lacak</span>
            </a>
            <CartNavLink />
          </nav>
        </div>
      </header>
    </>
  );
}