// Konfigurasi tampilan landing page yang disimpan admin pada site_settings.
// Semua field selalu dicocokkan dengan default di sini, agar pengaturan
// lama/partial tidak merusak beranda.

export const DEFAULT_LANDING_CONFIG = {
  hero: {
    title: "Gamis pria sesuai ukuranmu",
    subtitle:
      "Pilih bahan dan warna, lihat harga langsung berubah, dan ketahui perkiraan selesai sebelum membayar. Dijahit khusus untukmu.",
    buttonText: "Belanja sekarang",
    buttonHref: "#pilih-model",
    imageUrl: null, // single hero image
  },
  kenapa: {
    title: "Kenapa pilih kami",
    subtitle: "Memesan gamis custom seharusnya jelas dari awal sampai barang tiba.",
    imageUrl: null, // optional background/image for this section
    items: [
      {
        title: "Ukuran pas, minim retur",
        text: "Panduan ukuran bergambar dan tabel ukuran per model. Data ukuran wajib lengkap sebelum pembayaran.",
      },
      {
        title: "Harga transparan",
        text: "Tambahan harga bahan dan ukuran terlihat langsung saat memilih. Ongkir jelas sebelum membayar.",
      },
      {
        title: "Estimasi selesai jelas",
        text: "Lama pengerjaan tertera di tiap produk, dan perkiraan tanggal selesai muncul begitu pembayaran diterima.",
      },
      {
        title: "Pantau tanpa akun",
        text: "Lihat progres dari dibayar, dijahit, sampai dikirim lewat kode pesanan. Tidak perlu daftar.",
      },
    ],
  },
  caraPesan: {
    enabled: true,
    title: "Cara pesan",
    steps: [
      { num: "01", title: "Pilih", desc: "Pilih model gamis, lalu tentukan bahan dan warna yang kamu suka." },
      { num: "02", title: "Ukur", desc: "Isi ukuran dengan bantuan panduan bergambar. Data ukuran wajib lengkap sebelum bayar." },
      { num: "03", title: "Bayar", desc: "Bayar lewat metode yang biasa kamu pakai. Kode pesanan dikirim ke email, progres bisa dipantau kapan saja." },
    ],
  },
  testimoni: {
    title: "Kata pembeli",
    items: [
      {
        title: "Ukuran pas banget",
        text: "Pertama kali pesan gamis online, takut gak pas. Ternyata tabel ukurannya detail banget, panduan ngukurnya jelas. Pas di badan, gak perlu alterasi.",
        author: "Budi S.",
        meta: "Jakarta · Gamis Harian Klasik",
      },
      {
        title: "Bahan nyaman, pengerjaan cepat",
        text: "Pesan buat acara nikah kakak. Bahan katun premium-nya adem, jahitan rapi. Dikirim sebelum estimasi. Recommended buat yang butuh gamis custom berkualitas.",
        author: "Ahmad R.",
        meta: "Bandung · Gamis Acara Premium",
      },
      {
        title: "Seragam kantor jadi rapi",
        text: "Pesan 5pcs buat tim. Prosesnya mudah, cukup kirim ukuran tiap orang. Harga grosir fair, kirimnya sekali paket. Tim puas, besok order lagi buat yang lain.",
        author: "Dewi L. (HR)",
        meta: "Surabaya · Gamis Seragam Kantor",
      },
    ],
  },
  faq: {
    title: "Pertanyaan umum",
    subtitle: "Belum menemukan jawabannya? Tanya admin lewat WhatsApp.",
    items: [
      {
        q: "Bagaimana cara mengukur supaya pas?",
        a: "Setiap produk punya tabel ukuran, dan ada panduan bergambar lewat tautan \"Cara mengukur\". Data ukuran wajib terisi lengkap sebelum kamu bisa membayar.",
      },
      {
        q: "Berapa lama pengerjaannya?",
        a: "Sekitar 7–14 hari, tergantung model. Hitungan dimulai setelah pembayaran diterima, dan perkiraan tanggal selesai tampil di halaman status pesananmu.",
      },
      {
        q: "Apakah bisa kirim ke luar Pulau Jawa?",
        a: "Saat ini kami hanya mengirim ke Pulau Jawa, lewat antar langsung atau kurir darat. Ongkir mengikuti wilayah dan terlihat sebelum membayar.",
      },
      {
        q: "Bagaimana cara membayar?",
        a: "Pembayaran lewat Midtrans, jadi kamu memilih metode yang tersedia di jendela pembayaran. Data pembayaranmu tidak disimpan di toko kami.",
      },
      {
        q: "Kode pesanan saya hilang, bagaimana?",
        a: "Buka halaman Lacak pesanan, pilih \"Lupa kode pesanan\", lalu isi email atau nomor HP. Kode dikirim ulang ke email yang kamu pakai saat checkout.",
      },
      {
        q: "Apakah pesanan bisa dibatalkan atau ditukar?",
        a: "Barang custom dibuat per pesanan, jadi pembatalan hanya bisa sebelum proses jahit dimulai. Untuk detail kebijakan, tanya admin lewat WhatsApp.",
      },
    ],
  },
  cta: {
    title: "Siap punya gamis yang pas di badanmu?",
    subtitle: "Pilih model, atur ukuran, dan lihat harganya langsung. Tidak perlu daftar akun.",
    buttonText: "Mulai pesan",
    buttonHref: "#pilih-model",
    waButtonText: "Tanya lewat WhatsApp",
  },
  koleksiTerbaru: {
    title: "Koleksi terbaru",
    items: [
      { imageUrl: null, caption: "Gamis harian", href: "#pilih-model", tall: true },
      { imageUrl: null, caption: "Gamis acara", href: "#pilih-model", tall: false },
      { imageUrl: null, caption: "Gamis seragam", href: "#pilih-model", tall: false },
    ],
  },
  pilihanBulanIni: {
    title: "Pilihan bulan ini",
    subtitle: "Produk unggulan",
    productName: "Gamis Acara Premium",
    description:
      "Bahan premium dengan potongan modern, cocok untuk acara formal dan semi-formal. Tersedia dalam berbagai pilihan warna klasik dan kontemporer.",
    price: "Mulai Rp 650.000",
    buttonText: "Lihat dan pesan",
    buttonHref: "#produk",
    imageUrl: null,
    stats: [
      { value: "7–14", label: "Hari pengerjaan" },
      { value: "M–XXL", label: "Pilihan ukuran" },
      { value: "Jawa", label: "Area kirim" },
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

function normalizeFeatures(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  return items.map((item, index) => ({
    title: pickString(item?.title, fallback[index]?.title || `Keunggulan ${index + 1}`),
    text: pickString(item?.text, fallback[index]?.text || ""),
  }));
}

function normalizeSteps(steps, fallback) {
  if (!Array.isArray(steps) || steps.length === 0) return fallback;
  return steps.map((step, index) => ({
    num: pickString(step?.num || step?.n, fallback[index]?.num || String(index + 1).padStart(2, "0")),
    title: pickString(step?.title, fallback[index]?.title || `Langkah ${index + 1}`),
    desc: pickString(step?.desc || step?.d, fallback[index]?.desc || ""),
  }));
}

function normalizeTestimoni(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  return items.map((item, index) => ({
    title: pickString(item?.title, fallback[index]?.title || `Testimoni ${index + 1}`),
    text: pickString(item?.text, fallback[index]?.text || ""),
    author: pickString(item?.author, fallback[index]?.author || "[Nama]"),
    meta: pickString(item?.meta, fallback[index]?.meta || "[Kota] · [Model]"),
  }));
}

function normalizeFAQ(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  return items.map((item, index) => ({
    q: pickString(item?.q, fallback[index]?.q || `Pertanyaan ${index + 1}`),
    a: pickString(item?.a, fallback[index]?.a || ""),
  }));
}

function normalizeStats(stats, fallback) {
  if (!Array.isArray(stats) || stats.length === 0) return fallback;
  return stats.map((stat, index) => ({
    value: pickString(stat?.value, fallback[index]?.value || ""),
    label: pickString(stat?.label, fallback[index]?.label || ""),
  }));
}

function normalizeKoleksiItems(items, fallback) {
  if (!Array.isArray(items) || items.length === 0) return fallback;
  return items.map((item, index) => ({
    imageUrl:
      typeof item?.imageUrl === "string" && item.imageUrl.trim()
        ? item.imageUrl.trim()
        : null,
    caption: pickString(item?.caption, fallback[index]?.caption || `Koleksi ${index + 1}`),
    href: pickString(item?.href, fallback[index]?.href || "#pilih-model"),
    tall: typeof item?.tall === "boolean" ? item.tall : fallback[index]?.tall ?? false,
  }));
}

export function normalizeLandingConfig(raw) {
  const source = isObject(raw) ? raw : {};
  const hero = isObject(source.hero) ? source.hero : {};
  const kenapa = isObject(source.kenapa) ? source.kenapa : {};
  const caraPesan = isObject(source.caraPesan) ? source.caraPesan : {};
  const testimoni = isObject(source.testimoni) ? source.testimoni : {};
  const faq = isObject(source.faq) ? source.faq : {};
  const cta = isObject(source.cta) ? source.cta : {};
  const koleksiTerbaru = isObject(source.koleksiTerbaru) ? source.koleksiTerbaru : {};
  const pilihanBulanIni = isObject(source.pilihanBulanIni) ? source.pilihanBulanIni : {};
  const contact = isObject(source.contact) ? source.contact : {};
  const seo = isObject(source.seo) ? source.seo : {};

  // Backward compat: migrate old 'why' to 'kenapa'
  const whySource = isObject(source.why) ? source.why : {};

  const normalized = {
    hero: {
      title: pickString(hero.title, DEFAULT_LANDING_CONFIG.hero.title),
      subtitle: pickString(hero.subtitle, DEFAULT_LANDING_CONFIG.hero.subtitle),
      buttonText: pickString(hero.buttonText, DEFAULT_LANDING_CONFIG.hero.buttonText),
      buttonHref: pickString(hero.buttonHref, DEFAULT_LANDING_CONFIG.hero.buttonHref),
      imageUrl:
        typeof hero.imageUrl === "string" && hero.imageUrl.trim()
          ? hero.imageUrl.trim()
          : null,
    },
    kenapa: {
      title: pickString(kenapa.title || whySource.title, DEFAULT_LANDING_CONFIG.kenapa.title),
      subtitle: pickString(kenapa.subtitle || whySource.subtitle, DEFAULT_LANDING_CONFIG.kenapa.subtitle),
      imageUrl:
        typeof kenapa.imageUrl === "string" && kenapa.imageUrl.trim()
          ? kenapa.imageUrl.trim()
          : typeof whySource.imageUrl === "string" && whySource.imageUrl.trim()
          ? whySource.imageUrl.trim()
          : null,
      items: normalizeFeatures(kenapa.items || whySource.items, DEFAULT_LANDING_CONFIG.kenapa.items),
    },
    caraPesan: {
      enabled: pickBoolean(caraPesan.enabled, DEFAULT_LANDING_CONFIG.caraPesan.enabled),
      title: pickString(caraPesan.title, DEFAULT_LANDING_CONFIG.caraPesan.title),
      steps: normalizeSteps(caraPesan.steps, DEFAULT_LANDING_CONFIG.caraPesan.steps),
    },
    testimoni: {
      title: pickString(testimoni.title, DEFAULT_LANDING_CONFIG.testimoni.title),
      items: normalizeTestimoni(testimoni.items, DEFAULT_LANDING_CONFIG.testimoni.items),
    },
    faq: {
      title: pickString(faq.title, DEFAULT_LANDING_CONFIG.faq.title),
      subtitle: pickString(faq.subtitle, DEFAULT_LANDING_CONFIG.faq.subtitle),
      items: normalizeFAQ(faq.items, DEFAULT_LANDING_CONFIG.faq.items),
    },
    cta: {
      title: pickString(cta.title, DEFAULT_LANDING_CONFIG.cta.title),
      subtitle: pickString(cta.subtitle, DEFAULT_LANDING_CONFIG.cta.subtitle),
      buttonText: pickString(cta.buttonText, DEFAULT_LANDING_CONFIG.cta.buttonText),
      buttonHref: pickString(cta.buttonHref, DEFAULT_LANDING_CONFIG.cta.buttonHref),
      waButtonText: pickString(cta.waButtonText, DEFAULT_LANDING_CONFIG.cta.waButtonText),
    },
    koleksiTerbaru: {
      title: pickString(koleksiTerbaru.title, DEFAULT_LANDING_CONFIG.koleksiTerbaru.title),
      items: normalizeKoleksiItems(koleksiTerbaru.items, DEFAULT_LANDING_CONFIG.koleksiTerbaru.items),
    },
    pilihanBulanIni: {
      title: pickString(pilihanBulanIni.title, DEFAULT_LANDING_CONFIG.pilihanBulanIni.title),
      subtitle: pickString(pilihanBulanIni.subtitle, DEFAULT_LANDING_CONFIG.pilihanBulanIni.subtitle),
      productName: pickString(pilihanBulanIni.productName, DEFAULT_LANDING_CONFIG.pilihanBulanIni.productName),
      description: pickString(pilihanBulanIni.description, DEFAULT_LANDING_CONFIG.pilihanBulanIni.description),
      price: pickString(pilihanBulanIni.price, DEFAULT_LANDING_CONFIG.pilihanBulanIni.price),
      buttonText: pickString(pilihanBulanIni.buttonText, DEFAULT_LANDING_CONFIG.pilihanBulanIni.buttonText),
      buttonHref: pickString(pilihanBulanIni.buttonHref, DEFAULT_LANDING_CONFIG.pilihanBulanIni.buttonHref),
      imageUrl:
        typeof pilihanBulanIni.imageUrl === "string" && pilihanBulanIni.imageUrl.trim()
          ? pilihanBulanIni.imageUrl.trim()
          : null,
      stats: normalizeStats(pilihanBulanIni.stats, DEFAULT_LANDING_CONFIG.pilihanBulanIni.stats),
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