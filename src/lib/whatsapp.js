// Menyusun tautan wa.me berisi pesan siap kirim. WhatsApp tidak memakai API
// resmi di MVP; tautan ini dibuka di browser/WhatsApp pembeli.
import { ADMIN_WA_DEFAULT } from "@/lib/constants";

function digitsOnly(value) {
  return String(value ?? "").replace(/[^\d]/g, "");
}

// Normalisasi ke bentuk internasional 628... (tanpa +, spasi, atau tanda).
export function normalizeWaPhone(raw) {
  const digits = digitsOnly(raw);
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

export function adminWaPhone() {
  return normalizeWaPhone(process.env.NEXT_PUBLIC_ADMIN_WA || ADMIN_WA_DEFAULT);
}

// Pesan siap kirim. Teks dikodekan dengan encodeURIComponent.
export function buildWaLink(phone, message) {
  const target = normalizeWaPhone(phone) || adminWaPhone();
  const base = `https://wa.me/${target}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(String(message))}`;
}

export function buildAdminLink(message) {
  return buildWaLink(adminWaPhone(), message);
}

export function productInquiryMessage(productName) {
  return `Halo, saya tertarik dengan ${productName || "gamis"} ini. Bisa info lebih lanjut?`;
}

export function orderInquiryMessage(orderCode) {
  return `Halo admin, saya ingin bertanya tentang pesanan ${orderCode || ""}. Terima kasih.`;
}

export function orderStatusMessage({ orderCode, status, courier, trackingNumber }) {
  const parts = [`Pesanan ${orderCode || ""}`.trim()];
  if (status) parts.push(`status: ${status}`);
  if (courier) parts.push(`kurir: ${courier}`);
  if (trackingNumber) parts.push(`resi: ${trackingNumber}`);
  return `${parts.join(" | ")}.\nHalo admin, mohon update pengirimannya.`;
}