"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin/pesanan", label: "Pesanan" },
  { href: "/admin/produk", label: "Produk" },
  { href: "/admin/ongkir", label: "Ongkir" },
  { href: "/admin/tampilan", label: "Tampilan" },
];

function isActive(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminNavLinks() {
  const pathname = usePathname() || "";

  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Navigasi admin">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              "inline-flex min-h-11 items-center rounded-lg px-3 transition " +
              (active ? "bg-zaitun-hover font-semibold" : "hover:bg-zaitun-hover")
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
