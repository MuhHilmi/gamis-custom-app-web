// Wrapper Midtrans: membuat Snap token, memverifikasi signature webhook,
// memetakan status transaksi, dan memanggil Status API sebagai cadangan.
// Semua fungsi ini hanya boleh dipakai di server (server key rahasia).
import "server-only";
import crypto from "node:crypto";

export function isProduction() {
  return String(process.env.MIDTRANS_IS_PRODUCTION).toLowerCase() === "true";
}

export function snapBaseUrl() {
  return isProduction()
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";
}

export function apiBaseUrl() {
  return isProduction()
    ? "https://api.midtrans.com"
    : "https://api.sandbox.midtrans.com";
}

function serverKey() {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key) throw new Error("MIDTRANS_SERVER_KEY belum diisi");
  return key;
}

function authorization() {
  return "Basic " + Buffer.from(serverKey() + ":").toString("base64");
}

async function midtransFetch(url, options) {
  const response = await fetch(url, options);
  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  if (!response.ok) {
    const message =
      (Array.isArray(json?.error_messages) && json.error_messages.join(", ")) ||
      json?.status_message ||
      `Midtrans merespons ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = json;
    throw error;
  }
  return json;
}

// Buat transaksi Snap. orderId memakai kode pesanan (GM-...).
// itemDetails wajib berjumlah sama dengan grossAmount agar Midtrans lolos.
export async function createSnapTransaction({
  orderId,
  grossAmount,
  itemDetails = [],
  customer = {},
} = {}) {
  const data = await midtransFetch(`${snapBaseUrl()}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: authorization(),
    },
    body: JSON.stringify({
      transaction_details: { order_id: orderId, gross_amount: grossAmount },
      item_details: itemDetails,
      customer_details: customer,
    }),
  });
  return { token: data.token, redirectUrl: data.redirect_url };
}

// Verifikasi signature SHA512 dari notifikasi Midtrans. Pakai nilai persis
// dari badan notifikasi (jangan menghitung ulang grossAmount).
export function verifyWebhookSignature({ orderId, statusCode, grossAmount, signatureKey } = {}) {
  const key = process.env.MIDTRANS_SERVER_KEY;
  if (!key || !signatureKey) return false;
  const expected = crypto
    .createHash("sha512")
    .update(String(orderId) + String(statusCode) + String(grossAmount) + key)
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(String(signatureKey), "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Peta status Midtrans ke status pesanan. Hanya mengembalikan status yang
// boleh diubah otomatis; null berarti "tidak ada perubahan status".
export function mapTransactionStatus(payload) {
  const transactionStatus = payload?.transaction_status;
  const statusCode = payload?.status_code;
  const fraudStatus = payload?.fraud_status;

  if (transactionStatus === "settlement" && statusCode === "200") {
    return "dibayar";
  }
  if (
    transactionStatus === "capture" &&
    statusCode === "200" &&
    fraudStatus === "accept"
  ) {
    return "dibayar";
  }
  if (transactionStatus === "expire") return "kedaluwarsa";
  if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "failure") {
    return "dibatalkan";
  }
  // pending, authorize, refund, chargeback, dsb.: dicatat, tidak diubah otomatis.
  return null;
}

// Cadangan bila notifikasi telat/hilang: panggil Status API lalu petakan.
export async function getTransactionStatus(orderId) {
  return midtransFetch(`${apiBaseUrl()}/v2/${encodeURIComponent(orderId)}/status`, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: authorization() },
  });
}