"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CART_KEY = "gamis-cart";
const CART_EVENT = "cart:changed";

function readCartCount() {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce((sum, item) => {
      const quantity = Number(item?.quantity);
      return sum + (Number.isFinite(quantity) && quantity > 0 ? Math.trunc(quantity) : 1);
    }, 0);
  } catch {
    return 0;
  }
}

export default function CartNavLink() {
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const isEmpty = loaded && count === 0;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCount(readCartCount());
      setLoaded(true);
    }, 0);

    function sync() {
      setCount(readCartCount());
      setLoaded(true);
    }

    window.addEventListener("storage", sync);
    window.addEventListener(CART_EVENT, sync);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("storage", sync);
      window.removeEventListener(CART_EVENT, sync);
    };
  }, []);

  const badgeCount = count > 99 ? "99+" : String(count);

  return (
    <Link
      href="/keranjang"
      aria-label={loaded && count > 0 ? `Keranjang, ${count} barang` : "Keranjang"}
      className={
        "group relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-teks hover:bg-krem focus-visible:outline-krem" +
        // Menegaskan keranjang kosong lewat goyangan singkat sekali jalan.
        (isEmpty ? " cart-nudge" : "")
      }
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="group-hover:animate-[wiggle_0.4s_ease-in-out]"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {loaded && count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-krem px-1 text-xs font-bold text-zaitun">
          {badgeCount}
        </span>
      ) : null}
    </Link>
  );
}
