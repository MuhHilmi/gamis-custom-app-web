"use client";

import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <nav className="hidden items-center gap-2 text-sm md:flex" aria-label="Navigasi admin">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                "inline-flex min-h-11 items-center rounded-lg px-3 text-krem transition " +
                (active ? "bg-zaitun-hover font-semibold" : "hover:bg-zaitun-hover")
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        ref={toggleRef}
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg hover:bg-zaitun-hover md:hidden"
        aria-expanded={open}
        aria-controls="admin-menu"
        aria-label={open ? "Tutup menu admin" : "Buka menu admin"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open && (
        <div
          id="admin-menu"
          className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-lg bg-zaitun text-krem shadow-xl ring-1 ring-white/15 md:hidden"
        >
          <nav className="flex flex-col" aria-label="Navigasi admin mobile" onClick={() => setOpen(false)}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    "flex min-h-11 items-center px-4 text-sm text-krem transition " +
                    (active
                      ? "bg-zaitun-hover font-semibold"
                      : "hover:bg-zaitun-hover")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
