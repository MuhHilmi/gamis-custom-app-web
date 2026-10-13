import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export default function Header() {
  return (
    <header className="bg-zaitun text-krem">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-serif text-xl font-semibold focus-visible:outline-krem"
        >
          {SITE_NAME}
        </Link>
        <nav aria-label="Navigasi utama" className="flex items-center gap-1">
          <Link
            href="/lacak"
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-zaitun-hover focus-visible:outline-krem"
          >
            Lacak pesanan
          </Link>
          <Link
            href="/keranjang"
            className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold hover:bg-zaitun-hover focus-visible:outline-krem"
          >
            Keranjang
          </Link>
        </nav>
      </div>
    </header>
  );
}
