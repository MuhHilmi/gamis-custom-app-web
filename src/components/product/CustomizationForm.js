"use client";

import { useMemo, useState } from "react";
import { calculateLine } from "@/lib/pricing";
import { formatRupiah } from "@/lib/format";

const CART_KEY = "gamis-cart";

function groupByType(options) {
  const groups = { ukuran: [], bahan: [], warna: [] };
  for (const option of options || []) {
    if (groups[option.type]) groups[option.type].push(option);
  }
  return groups;
}

function findOption(options, type, name) {
  return (options || []).find((option) => option.type === type && option.name === name);
}

export default function CustomizationForm({ product, options = [] }) {
  const groups = useMemo(() => groupByType(options), [options]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  const sizeOption = findOption(options, "ukuran", selectedSize);
  const materialOption = findOption(options, "bahan", selectedMaterial);
  const colorOption = findOption(options, "warna", selectedColor);

  const selectedOptions = [sizeOption, materialOption, colorOption].filter(Boolean);
  const line = calculateLine({
    basePrice: product?.base_price ?? 0,
    options: selectedOptions,
    quantity,
  });

  const missing = !selectedSize
    ? "Pilih ukuran dulu"
    : !selectedMaterial
      ? "Pilih bahan dulu"
      : !selectedColor
        ? "Pilih warna dulu"
        : null;

  function addToCart() {
    if (missing) return;
    try {
      const raw = localStorage.getItem(CART_KEY);
      const cart = raw ? JSON.parse(raw) : [];
      // ID acak hanya dibuat saat tombol ditekan (event handler), bukan saat render.
      // eslint-disable-next-line react-hooks/purity
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const item = {
        id,
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        basePrice: product.base_price,
        quantity,
        unitPrice: line.unitPrice,
        lineTotal: line.lineTotal,
        size: selectedSize,
        material: selectedMaterial,
        color: selectedColor,
        photo: product?.photos?.[0] || null,
        optionDeltas: selectedOptions.map((option) => ({
          type: option.type,
          name: option.name,
          priceDelta: option.price_delta,
        })),
        addedAt: new Date().toISOString(),
      };
      localStorage.setItem(CART_KEY, JSON.stringify([...cart, item]));
      window.dispatchEvent(new Event("cart:changed"));
      setToast("Masuk keranjang");
      window.setTimeout(() => setToast(null), 2500);
    } catch (error) {
      // Beberapa browser (mode privat/penyimpanan penuh) bisa menolak localStorage.
      console.error("[keranjang] gagal menyimpan:", error?.message || error);
      setToast(
        "Gagal menyimpan ke keranjang. Coba lagi atau periksa penyimpanan browser."
      );
      window.setTimeout(() => setToast(null), 3000);
    }

  }

  return (
    <div className="flex flex-col gap-6">
      {/* Ukuran */}
      {groups.ukuran.length > 0 ? (
        <fieldset>
          <legend className="font-serif text-base font-semibold">1. Ukuran</legend>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="radiogroup"
            aria-label="Pilih ukuran"
          >
            {groups.ukuran.map((option) => {
              const active = selectedSize === option.name;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedSize(option.name)}
                  className={
                    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-4 text-sm font-medium transition " +
                    (active
                      ? "border-zaitun bg-zaitun text-krem"
                      : "border-garis-input bg-putih text-teks hover:border-zaitun")
                  }
                >
                  <span>{option.name}</span>
                  {option.price_delta > 0 ? (
                    <span className="ml-1 text-xs tabular-nums">
                      +{formatRupiah(option.price_delta)}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Bahan */}
      {groups.bahan.length > 0 ? (
        <fieldset>
          <legend className="font-serif text-base font-semibold">2. Bahan</legend>
          <div
            className="mt-2 grid gap-2"
            role="radiogroup"
            aria-label="Pilih bahan"
          >
            {groups.bahan.map((option) => {
              const active = selectedMaterial === option.name;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedMaterial(option.name)}
                  className={
                    "flex min-h-11 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition " +
                    (active
                      ? "border-zaitun bg-zaitun-muda"
                      : "border-garis-input bg-putih hover:border-zaitun")
                  }
                >
                  <span className="font-medium">{option.name}</span>
                  {option.price_delta > 0 ? (
                    <span className="text-sm tabular-nums text-zaitun">
                      +{formatRupiah(option.price_delta)}
                    </span>
                  ) : (
                    <span className="text-sm text-teks-sekunder">Tanpa tambahan</span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Warna */}
      {groups.warna.length > 0 ? (
        <fieldset>
          <legend className="font-serif text-base font-semibold">3. Warna</legend>
          <div
            className="mt-2 flex flex-wrap gap-3"
            role="radiogroup"
            aria-label="Pilih warna"
          >
            {groups.warna.map((option) => {
              const active = selectedColor === option.name;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={option.name}
                  onClick={() => setSelectedColor(option.name)}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={
                      "h-11 w-11 rounded-full border-2 " +
                      (active ? "border-zaitun ring-2 ring-zaitun" : "border-garis-input")
                    }
                    style={{ backgroundColor: option.swatch_hex || "#cccccc" }}
                  />
                  <span className="text-xs">{option.name}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Catatan kustom */}
      <fieldset>
        <legend className="font-serif text-base font-semibold">4. Catatan (opsional)</legend>
        <label className="mt-2 block">
          <span className="sr-only">Catatan kustom</span>
          <textarea
            value={customNote}
            onChange={(event) => setCustomNote(event.target.value)}
            rows={3}
            maxLength={300}
            placeholder="Contoh: panjang tangan +2 cm, tanpa kantong, dll."
            className="block w-full rounded-lg border border-garis-input bg-putih px-4 py-3 text-sm text-teks focus:border-zaitun focus:outline-none"
          />
        </label>
        <p className="mt-1 text-xs text-teks-sekunder">
          {customNote.trim().length}/300 karakter.
        </p>
      </fieldset>

      {/* Jumlah */}
      <fieldset>
        <legend className="font-serif text-base font-semibold">5. Jumlah</legend>
        <div className="mt-2 inline-flex items-center overflow-hidden rounded-lg border border-garis-input bg-putih">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-lg"
            aria-label="Kurangi jumlah"
          >
            −
          </button>
          <span className="min-w-12 text-center tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(99, value + 1))}
            className="inline-flex min-h-11 min-w-11 items-center justify-center text-lg"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
      </fieldset>

      {/* Ringkasan harga langsung */}
      <section
        aria-labelledby="ringkasan-harga"
        className="rounded-lg bg-putih p-4 ring-1 ring-garis"
      >
        <h3
          id="ringkasan-harga"
          className="font-serif text-base font-semibold text-teks"
        >
          Rincian harga
        </h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-teks-sekunder">Harga dasar</span>
            <span className="tabular-nums font-medium text-teks">
              {formatRupiah(product?.base_price ?? 0)}
            </span>
          </div>
          {sizeOption ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-teks-sekunder">Ukuran {sizeOption.name}</span>
              <span className="tabular-nums font-medium text-teks">
                {sizeOption.price_delta > 0
                  ? `+${formatRupiah(sizeOption.price_delta)}`
                  : "Sudah termasuk"}
              </span>
            </div>
          ) : null}
          {materialOption ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-teks-sekunder">Bahan {materialOption.name}</span>
              <span className="tabular-nums font-medium text-teks">
                {materialOption.price_delta > 0
                  ? `+${formatRupiah(materialOption.price_delta)}`
                  : "Sudah termasuk"}
              </span>
            </div>
          ) : null}
          {selectedColor ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-teks-sekunder">Warna {selectedColor}</span>
              <span className="tabular-nums font-medium text-teks">
                Sudah termasuk
              </span>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 border-t border-garis pt-3">
            <span className="font-semibold text-teks">Perkiraan total</span>
            <span className="text-lg font-bold tabular-nums text-zaitun">
              {formatRupiah(line.lineTotal)}
            </span>
          </div>
        </div>
        <p className="mt-3 text-xs text-teks">
          Harga ini perkiraan di browser. Server menghitung ulang saat checkout.
        </p>
      </section>

      {/* Bilah bawah menempel */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-6 border-t border-garis bg-putih/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(31,42,36,0.08)] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0 sm:shadow-none sm:backdrop-blur-none">
        <div className="flex items-center gap-3">
          <div className="min-w-0 shrink-0 text-left">
            <p className="text-xs font-medium text-teks-sekunder">Perkiraan total</p>
            <p className="text-xl font-bold tabular-nums leading-tight text-zaitun">
              {formatRupiah(line.lineTotal)}
            </p>
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={Boolean(missing)}
            aria-disabled={Boolean(missing)}
            className={
              "flex min-h-12 flex-1 items-center justify-center rounded-lg px-4 text-sm font-semibold text-krem transition focus-visible:outline-zaitun " +
              (missing
                ? "cursor-not-allowed bg-zaitun/45"
                : "bg-zaitun shadow-sm hover:bg-zaitun-hover active:translate-y-px")
            }
          >
            {missing ? missing : "Tambah ke keranjang"}
          </button>
        </div>
        {missing ? (
          <p className="mt-2 text-xs text-teks-sekunder">{missing}</p>
        ) : null}
      </div>

      {toast ? (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-teks px-4 py-2 text-sm text-krem shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
