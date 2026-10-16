// Konfigurasi tampilan landing page yang disimpan admin pada site_settings.
// Semua field selalu dicocokkan dengan default di sini, agar pengaturan
// lama/partial tidak merusak beranda.

export const LANDING_SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price", label: "Harga termurah" },
  { value: "name", label: "Nama A-Z" },
];

export const DEFAULT_LANDING_CONFIG = {
  hero: {
    title: "Gamis pria dijahit sesuai ukuranmu",
    subtitle:
      "Pilih bahan dan warna, lihat harga langsung berubah, dan ketahui perkiraan selesai sebelum membayar. Pengerjaan sekitar 7–14 hari.",
    buttonText: "Lihat koleksi",
    buttonHref: "#koleksi",
    images: [null, null, null],
  },
  catalog: {
    title: "Koleksi gamis",
    showCategoryFilter: true,
    limit: 8,
    sort: "newest",
  },
  why: {
    title: "Kenapa pilih kami",
    subtitle: "Memesan gamis custom seharusnya jelas dari awal sampai barang tiba.",
    imageUrl: null,
    items: [
      {
        title: "Ukuran pas, minim retur",
        text: "Panduan ukuran bergambar dan tabel ukuran per model. Data ukuran wajib lengkap sebelum pembayaran.",
      },
      {
        title: "Harga transparan",
        text: "Tambahan harga bahan dan ukuran terlihat langsung saat memilih. Ongkir jelas sebelum Anda membayar.",
      },
      {
        title: "Estimasi selesai yang jelas",
        text: "Lama pengerjaan tertera di tiap produk, dan perkiraan tanggal selesai muncul begitu pembayaran diterima.",
      },
      {
        title: "Pantau tanpa akun",
        text: "Lihat progres dari dibayar, dijahit, sampai dikirim lewat kode pesanan. Tidak perlu daftar.",
      },
    ],
  },
  howToOrder: {
    enabled: true,
    title: "Cara pesan",
    subtitle: "Tiga langkah, tanpa perlu membuat akun.",
    steps: [
      { n: "1", t: "Pilih", d: "Pilih model gamis, lalu tentukan bahan dan warna yang Anda suka." },
      { n: "2", t: "Ukur", d: "Isi ukuran dengan bantuan panduan bergambar. Data ukuran wajib lengkap sebelum bayar." },
      { n: "3", t: "Bayar", d: "Bayar lewat metode yang biasa Anda pakai. Kode pesanan dikirim ke email, progres bisa dipantau kapan saja." },
    ],
  },
  contact: {
    whatsappPhone: null,
    buttonText: "Tanya lewat WhatsApp",
    message: "Gamis",
  },
  seo: {
    title: "Gamis Custom - Gamis Pria Dijahit Sesuai Ukuranmu",
    description:
      "Pesan gamis pria custom: pilih ukuran, bahan, dan warna sendiri. Harga dan estimasi pengerjaan langsung terlihat.",
  },
};

function isObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function pickString(value, fallback) {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed || fallback;
}

function pickBoolean(value, fallback) {
  return typeof value === "boolean" ? value : fallback;
}

function pickNumber(value, fallback, { min = 1, max = 24 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function normalizeSteps(steps, fallback) {
  if (!Array.isArray(steps) || steps.length === 0) return fallback;
  return steps
    .map((step, index) => ({
      n: String(step?.n || step?.number || index + 1).trim() || String(index + 1),
      t: pickString(step?.t || step?.title, fallback[index]?.t || `Langkah ${index + 1}`),
      d: pickString(step?.d || step?.text, fallback[index]?.d || ""),
    }))
    .filter((step) => step.t);
}

function normalizeFeatures(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  return items.map((item, index) => ({
    title: pickString(item?.title, fallback[index]?.title || `Keunggulan ${index + 1}`),
    text: pickString(item?.text, fallback[index]?.text || ""),
  }));
}

export function normalizeLandingConfig(raw) {
  const source = isObject(raw) ? raw : {};
  const hero = isObject(source.hero) ? source.hero : {};
  const catalog = isObject(source.catalog) ? source.catalog : {};
  const why = isObject(source.why) ? source.why : {};
  const howToOrder = isObject(source.howToOrder) ? source.howToOrder : {};
  const contact = isObject(source.contact) ? source.contact : {};
  const seo = isObject(source.seo) ? source.seo : {};

  const rawHeroImages = Array.isArray(hero.images)
    ? hero.images
    : hero.imageUrl
      ? [hero.imageUrl]
      : [];
  const heroImages = [0, 1, 2].map((index) => {
    const value = rawHeroImages[index];
    return typeof value === "string" && value.trim() ? value.trim() : null;
  });

  const normalized = {
    hero: {
      title: pickString(hero.title, DEFAULT_LANDING_CONFIG.hero.title),
      subtitle: pickString(hero.subtitle, DEFAULT_LANDING_CONFIG.hero.subtitle),
      buttonText: pickString(hero.buttonText, DEFAULT_LANDING_CONFIG.hero.buttonText),
      buttonHref: pickString(hero.buttonHref, DEFAULT_LANDING_CONFIG.hero.buttonHref),
      images: heroImages,
    },
    catalog: {
      title: pickString(catalog.title, DEFAULT_LANDING_CONFIG.catalog.title),
      showCategoryFilter: pickBoolean(
        catalog.showCategoryFilter,
        DEFAULT_LANDING_CONFIG.catalog.showCategoryFilter
      ),
      limit: pickNumber(catalog.limit, DEFAULT_LANDING_CONFIG.catalog.limit, { min: 4, max: 24 }),
      sort: ["newest", "price", "name"].includes(catalog.sort)
        ? catalog.sort
        : DEFAULT_LANDING_CONFIG.catalog.sort,
    },
    why: {
      title: pickString(why.title, DEFAULT_LANDING_CONFIG.why.title),
      subtitle: pickString(why.subtitle, DEFAULT_LANDING_CONFIG.why.subtitle),
      imageUrl: typeof why.imageUrl === "string" && why.imageUrl.trim() ? why.imageUrl.trim() : null,
      items: normalizeFeatures(why.items, DEFAULT_LANDING_CONFIG.why.items),
    },
    howToOrder: {
      enabled: pickBoolean(howToOrder.enabled, DEFAULT_LANDING_CONFIG.howToOrder.enabled),
      title: pickString(howToOrder.title, DEFAULT_LANDING_CONFIG.howToOrder.title),
      subtitle: pickString(howToOrder.subtitle, DEFAULT_LANDING_CONFIG.howToOrder.subtitle),
      steps: normalizeSteps(howToOrder.steps, DEFAULT_LANDING_CONFIG.howToOrder.steps),
    },
    contact: {
      whatsappPhone:
        typeof contact.whatsappPhone === "string" && contact.whatsappPhone.trim()
          ? contact.whatsappPhone.trim()
          : null,
      buttonText: pickString(contact.buttonText, DEFAULT_LANDING_CONFIG.contact.buttonText),
      message: pickString(contact.message, DEFAULT_LANDING_CONFIG.contact.message),
    },
    seo: {
      title: pickString(seo.title, DEFAULT_LANDING_CONFIG.seo.title),
      description: pickString(seo.description, DEFAULT_LANDING_CONFIG.seo.description),
    },
  };

  return normalized;
}

export function landingSortToSupabase(sort) {
  if (sort === "price") return { column: "base_price", ascending: true };
  if (sort === "name") return { column: "name", ascending: true };
  return { column: "created_at", ascending: false };
}
