// Pengiriman email lewat SMTP Gmail (Nodemailer). Kegagalan email tidak boleh
// memutus alur utama: fungsi mengembalikan hasil, tidak melempar.
import "server-only";
import nodemailer from "nodemailer";

let cachedTransporter = undefined;

function createTransporter() {
  if (cachedTransporter !== undefined) return cachedTransporter;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    cachedTransporter = null;
    return null;
  }
  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return cachedTransporter;
}

export async function sendMail({ to, subject, text, html } = {}) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("[email] GMAIL_USER/GMAIL_APP_PASSWORD belum diisi; email dilewati");
    return { ok: false, reason: "not_configured" };
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    return { ok: true, messageId: info.messageId };
  } catch (error) {
    console.error("[email] gagal mengirim:", error?.message);
    return { ok: false, reason: "send_failed", error: error?.message };
  }
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}

export async function sendOrderConfirmationEmail({ to, orderCode, statusUrl } = {}) {
  const link = statusUrl || `${siteUrl()}/pesanan/${orderCode}`;
  return sendMail({
    to,
    subject: `Konfirmasi pesanan ${orderCode}`,
    text: `Pesanan ${orderCode} kami terima. Pembayaran sedang diproses. Simpan kode ini: ${orderCode}. Pantau status di ${link}`,
    html: `<p>Pesanan <strong>${orderCode}</strong> kami terima.</p><p>Simpan kode pesanan ini dan pantau statusnya di <a href="${link}">${link}</a>.</p>`,
  });
}

export async function sendStatusChangedEmail({ to, orderCode, status, estimatedReadyAt, courier, trackingNumber } = {}) {
  const link = `${siteUrl()}/pesanan/${orderCode}`;
  const lines = [`Pesanan ${orderCode} kini berstatus: ${status}.`];
  if (estimatedReadyAt) lines.push(`Perkiraan siap: ${estimatedReadyAt}.`);
  if (courier) lines.push(`Kurir: ${courier}.`);
  if (trackingNumber) lines.push(`Resi: ${trackingNumber}.`);
  lines.push(`Pantau di ${link}.`);
  return sendMail({
    to,
    subject: `Status pesanan ${orderCode} diperbarui`,
    text: lines.join(" "),
    html: `<p>${lines.join(" ")}</p><p><a href="${link}">${link}</a></p>`,
  });
}

export async function sendForgotCodeEmail({ to, orderCode } = {}) {
  const link = `${siteUrl()}/pesanan/${orderCode}`;
  return sendMail({
    to,
    subject: `Kode pesanan Anda`,
    text: `Kode pesanan Anda: ${orderCode}. Buka status pesanan di ${link}`,
    html: `<p>Kode pesanan Anda: <strong>${orderCode}</strong>.</p><p><a href="${link}">${link}</a></p>`,
  });
}