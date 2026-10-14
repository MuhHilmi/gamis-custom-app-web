"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatRupiah } from "@/lib/format";
import { productPhotoUrl } from "@/lib/storage";
import { lineTotal, subtotalOfLines } from "@/lib/pricing";

const CART_KEY = "gamis-cart";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Abaikan kegagalan penyimpanan lokal.
  }
}

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setItems(readCart());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateQuantity(id, nextQuantity) {
    const quantity = Math.max(1, Math.min(99, Number(nextQuantity) || 1));
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id
          ? { ...item, quantity, lineTotal: lineTotal(item.unitPrice, quantity) }
          : item
      );
      writeCart(next);
      return next;
    });
  }

  function removeItem(id) {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      writeCart(next);
      return next;
    });
  }

  const subtotal = subtotalOfLines(items.map((item) => ({ lineTotal: item.lineTotal })));
  const isEmpty = loaded && items.length === 0;

  if (!loaded) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="font-serif text-2xl font-semibold">Keranjang</h1>
        <p className="mt-4 text-sm text-teks-sekunder">Memuat keranjang...</p>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold">Keranjang</h1>
        <p className="mt-4 text-sm text-teks-sekunder">Keranjangmu masih kosong</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-zaitun px-5 text-sm font-semibold text-krem hover:bg-zaitun-hover"
        >
          Lihat koleksi
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-serif text-2xl font-semibold">Keranjang</h1>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const photo =
            productPhotoUrl(item.photo) || "/product-photos/Gamis.jpg";
          return (
            <li
              key={item.id}
              className="flex gap-3 rounded-xl bg-putih p-3 shadow-sm ring-1 ring-garis sm:gap-4 sm:p-4"
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-krem-tua">
                <Image
                  src={photo}
                  alt={item.productName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 font-serif text-base font-semibold leading-snug">
                    <Link
                      href={`/produk/${item.productSlug}`}
                      className="hover:text-zaitun hover:underline"
                    >
                      {item.productName}
                    </Link>
                  </h2>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-xs font-medium text-merah hover:underline"
                    aria-label={`Hapus ${item.productName}`}
                  >
                    Hapus
                  </button>
                </div>

                <p className="mt-1 text-xs leading-relaxed text-teks-sekunder">
                  {item.size} · {item.material} · {item.color}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm tabular-nums text-teks-sekunder">
                      {formatRupiah(item.unitPrice)} / pcs
                    </p>
                    <div className="inline-flex items-center overflow-hidden rounded-lg border border-garis-input bg-putih">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center text-lg disabled:cursor-not-allowed disabled:text-garis-input"
                        aria-label="Kurangi jumlah"
                      >
                        −
                      </button>
                      <span className="min-w-12 text-center tabular-nums font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 99}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center text-lg disabled:cursor-not-allowed disabled:text-garis-input"
                        aria-label="Tambah jumlah"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-teks-sekunder">Subtotal item</p>
                    <p className="text-lg font-bold tabular-nums text-zaitun">
                      {formatRupiah(item.lineTotal)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/produk/${item.productSlug}`}
                  className="mt-2 inline-flex text-xs font-medium text-zaitun hover:underline"
                >
                  Ubah pilihan
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-lg bg-putih p-4 ring-1 ring-garis">
        <div className="flex items-center justify-between gap-3">
          <span className="text-teks-sekunder">Subtotal</span>
          <span className="text-lg font-bold tabular-nums text-zaitun">
            {formatRupiah(subtotal)}
          </span>
        </div>
        <p className="mt-2 text-xs text-teks">
          Ongkos kirim dihitung di halaman checkout. Harga di keranjang adalah
          perkiraan dan dikonfirmasi ulang oleh server.
        </p>
        <Link
          href="/checkout"
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover"
        >
          Lanjut ke checkout
        </Link>
      </div>
    </section>
  );
}
