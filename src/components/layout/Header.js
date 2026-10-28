import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import CartNavLink from "@/components/layout/CartNavLink";
import MobileNav from "@/components/layout/MobileNav";

export default function Header() {
  return (
    <>
      <div className="topbar">Pengerjaan 7–14 hari · Kirim ke seluruh Pulau Jawa</div>
      <header className="site-header">
        <div className="container header-in">
          <Link className="logo" href={"/"}>{SITE_NAME}</Link>
          <div className="header-end">
            <nav className="nav" aria-label="Navigasi utama">
              <Link href={"/"}>Beranda</Link>
              <a href="#pilih-model">Koleksi</a>
              <a href="#cara-pesan">Cara pesan</a>
              <a href="#faq">FAQ</a>
              <a href="/lacak" aria-label="Lacak pesanan">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 4h2l2.2 11h10.6L20 7H6.2" />
                  <circle cx="9" cy="19.5" r="1.4" />
                  <circle cx="17" cy="19.5" r="1.4" />
                </svg>
                <span>Lacak</span>
              </a>
            </nav>
            <div className="header-actions">
              <CartNavLink />
              <MobileNav>
                <Link href={"/"}>Beranda</Link>
                <a href="#pilih-model">Koleksi</a>
                <a href="#cara-pesan">Cara pesan</a>
                <a href="#faq">FAQ</a>
                <a href="/lacak">Lacak pesanan</a>
              </MobileNav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
