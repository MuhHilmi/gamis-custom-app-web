// Menghitung harga dari produk + opsi terpilih. Dipakai bersama oleh browser
// (pratinjau harga di form kustomisasi dan keranjang) dan oleh
// /api/checkout (sumber kebenaran). Satu aturan di dua tempat: total yang
// dilihat pembeli dan yang ditagih server tidak boleh berbeda.
//
// Semua bilangan bulat rupiah. Opsi yang tidak valid diabaikan.

function toInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

// Jumlah tambahan harga dari opsi yang dipilih.
export function sumPriceDeltas(options) {
  if (!Array.isArray(options)) return 0;
  return options.reduce((sum, option) => {
    const delta = toInt(option?.price_delta, 0);
    return sum + (delta < 0 ? 0 : delta);
  }, 0);
}

// Harga satuan = harga dasar + jumlah tambahan opsi.
export function unitPrice(basePrice, options) {
  const base = toInt(basePrice, 0);
  return Math.max(0, base + sumPriceDeltas(options));
}

// Total satu baris = harga satuan x jumlah.
export function lineTotal(unit, quantity) {
  const u = toInt(unit, 0);
  const q = Math.max(1, toInt(quantity, 1));
  return u * q;
}

// Satu baris pesanan siap hitung.
export function calculateLine({ basePrice, options, quantity = 1 } = {}) {
  const unit = unitPrice(basePrice, options);
  const qty = Math.max(1, toInt(quantity, 1));
  return { unitPrice: unit, quantity: qty, lineTotal: unit * qty };
}

// Subtotal dan total akhir pesanan.
export function subtotalOfLines(lines) {
  if (!Array.isArray(lines)) return 0;
  return lines.reduce((sum, line) => sum + toInt(line?.lineTotal, 0), 0);
}

export function totalOf(subtotal, shippingFee) {
  return Math.max(0, toInt(subtotal, 0) + Math.max(0, toInt(shippingFee, 0)));
}

// Hitung seluruh pesanan sekaligus, bentuk yang sama dipakai browser dan server.
export function calculateCart({ items, shippingFee = 0 } = {}) {
  const safeItems = Array.isArray(items) ? items : [];
  const lines = safeItems.map((item) =>
    calculateLine({
      basePrice: item?.basePrice ?? item?.base_price ?? 0,
      options: item?.options,
      quantity: item?.quantity ?? 1,
    })
  );
  const subtotal = subtotalOfLines(lines);
  const total = totalOf(subtotal, shippingFee);
  return {
    items: lines,
    subtotal,
    shippingFee: Math.max(0, toInt(shippingFee, 0)),
    total,
  };
}