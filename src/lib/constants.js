// Data toko sementara (dummy). Ganti sebelum go-live.
export const SITE_NAME = "TARDA";
export const SITE_TAGLINE = "Gamis pria dijahit sesuai ukuranmu";
export const ADMIN_WA_DEFAULT = "6281234567890";

export const ORDER_STATUS = {
  MENUNGGU_PEMBAYARAN: "menunggu_pembayaran",
  DIBAYAR: "dibayar",
  DIPROSES: "diproses",
  DIKERJAKAN: "dikerjakan",
  DIKIRIM: "dikirim",
  SELESAI: "selesai",
  KEDALUWARSA: "kedaluwarsa",
  DIBATALKAN: "dibatalkan",
};

// Label untuk pembeli (TECH_STACK.md bagian 7, UI_UX_SPEC.md bagian 4).
export const ORDER_STATUS_LABEL = {
  menunggu_pembayaran: "Menunggu pembayaran",
  dibayar: "Dibayar",
  diproses: "Diproses",
  dikerjakan: "Sedang dijahit",
  dikirim: "Dikirim",
  selesai: "Selesai",
  kedaluwarsa: "Kedaluwarsa",
  dibatalkan: "Dibatalkan",
};

// Urutan linimasa untuk pesanan yang berjalan normal.
export const ORDER_TIMELINE = [
  "menunggu_pembayaran",
  "dibayar",
  "diproses",
  "dikerjakan",
  "dikirim",
  "selesai",
];

// Transisi yang boleh dilakukan admin. Status "dibayar" hanya lewat webhook.
export const ADMIN_TRANSITIONS = {
  dibayar: ["diproses", "dibatalkan"],
  diproses: ["dikerjakan", "dibatalkan"],
  dikerjakan: ["dikirim"],
  dikirim: ["selesai"],
};

export const OPTION_TYPES = ["ukuran", "bahan", "warna"];

// Pengiriman hanya ke Pulau Jawa.
export const PROVINSI_JAWA = [
  "Banten",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
];
