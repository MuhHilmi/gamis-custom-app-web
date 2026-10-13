const rupiah = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

// 350000 -> "Rp 350.000"
export function formatRupiah(amount) {
  const n = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  return `Rp ${rupiah.format(n)}`;
}

// "2026-10-24T03:00:00Z" -> "24 Okt 2026" (zona waktu Asia/Jakarta)
export function formatTanggal(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(d);
}

export function formatTanggalWaktu(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(d);
}
