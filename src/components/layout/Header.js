import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import CartNavLink from "@/components/layout/CartNavLink";

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
            href="/katalog"
            className="relative inline-flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-zaitun-hover focus-visible:outline-krem after:absolute after:bottom-2 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100"
          >
            Katalog
          </Link>
          <Link
            href="/lacak"
            className="relative inline-flex min-h-11 items-center rounded-lg px-3 text-sm hover:bg-zaitun-hover focus-visible:outline-krem after:absolute after:bottom-2 after:left-3 after:right-3 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100"
          >
            Lacak pesanan
          </Link>
          <CartNavLink />
        </nav>
      </div>
    </header>
  );
}
