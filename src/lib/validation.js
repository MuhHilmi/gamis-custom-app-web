// Validasi input form pembeli dan body route API. Semua input dianggap
// tidak dipercaya; server wajib memvalidasi ulang. Nomor HP dinormalisasi
// ke bentuk 628... agar pencocokan di database selalu konsisten.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

export function toInt(value, fallback = null) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.trunc(n);
}

export function isPositiveInt(value) {
  const n = toInt(value);
  return n !== null && n > 0;
}

export function isNonNegativeInt(value) {
  const n = toInt(value);
  return n !== null && n >= 0;
}

export function isValidEmail(value) {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

// Normalisasi nomor HP Indonesia: 0812... dan +62 812... -> 62812...
export function normalizePhone(raw) {
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

export function isValidPhone(raw) {
  const normalized = normalizePhone(raw);
  return /^62\d{8,18}$/.test(normalized);
}

const VALID_SHIPPING_METHODS = ["antar_langsung", "kurir_darat"];

export function validateCheckout(input) {
  const data = input && typeof input === "object" ? input : {};
  const errors = {};

  const customerName = String(data.customerName ?? data.customer_name ?? "").trim();
  if (!customerName) errors.customerName = "Nama wajib diisi";

  const phoneRaw = data.customerPhone ?? data.customer_phone ?? "";
  if (!isValidPhone(phoneRaw)) {
    errors.customerPhone = "Nomor HP tidak valid. Contoh: 081234567890";
  }

  const email = String(data.customerEmail ?? data.customer_email ?? "").trim();
  if (!isValidEmail(email)) {
    errors.customerEmail = "Email tidak valid. Contoh: nama@email.com";
  }

  const address = String(data.address ?? "").trim();
  if (!address) errors.address = "Alamat wajib diisi";

  const city = String(data.city ?? "").trim();
  if (!city) errors.city = "Kota/kabupaten wajib diisi";

  const province = String(data.province ?? "").trim();
  if (!province) errors.province = "Provinsi wajib diisi";

  const postalCode = String(data.postalCode ?? data.postal_code ?? "").trim();
  // kode pos opsional, tetapi jika ada harus angka 5 digit
  if (postalCode && !/^\d{5}$/.test(postalCode)) {
    errors.postalCode = "Kode pos harus 5 digit";
  }

  const shippingMethod = data.shippingMethod ?? data.shipping_method;
  if (!VALID_SHIPPING_METHODS.includes(shippingMethod)) {
    errors.shippingMethod = "Pilih cara pengiriman";
  }

  const shippingZoneId = String(data.shippingZoneId ?? data.shipping_zone_id ?? "").trim();
  if (!shippingZoneId) errors.shippingZoneId = "Pilih zona pengiriman";

  const items = Array.isArray(data.items) ? data.items : [];
  if (items.length === 0) {
    errors.items = "Keranjang masih kosong";
  } else {
    items.forEach((item, index) => {
      const productId = String(item?.productId ?? item?.product_id ?? "").trim();
      if (!productId) errors[`items.${index}.productId`] = "Produk tidak valid";
      const quantity = toInt(item?.quantity, 0);
      if (!quantity || quantity < 1) {
        errors[`items.${index}.quantity`] = "Jumlah minimal 1";
      }
    });
  }

  const note = String(data.note ?? "").trim();

  const normalized = {
    customerName,
    customerPhone: String(phoneRaw ?? "").trim(),
    customerPhoneNorm: normalizePhone(phoneRaw),
    customerEmail: email,
    address,
    city,
    province,
    postalCode: postalCode || null,
    shippingMethod,
    shippingZoneId,
    items,
    note: note || null,
  };

  return { ok: Object.keys(errors).length === 0, errors, data: normalized };
}

export function validateTrackInput(input) {
  const data = input && typeof input === "object" ? input : {};
  const errors = {};
  const code = String(data.orderCode ?? data.code ?? "").trim();
  const phone = data.customerPhone ?? data.phone ?? "";

  if (!/^GM-[A-Za-z0-9]{10}$/.test(code)) {
    errors.orderCode = "Kode tidak valid";
  }
  if (!isValidPhone(phone)) {
    errors.customerPhone = "Nomor HP tidak valid. Contoh: 081234567890";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { orderCode: code, customerPhoneNorm: normalizePhone(phone) },
  };
}

export function validateForgotCodeInput(input) {
  const data = input && typeof input === "object" ? input : {};
  const errors = {};
  const value = String(data.emailOrPhone ?? data.email ?? data.phone ?? "").trim();

  if (!value) {
    errors.emailOrPhone = "Isi email atau nomor HP";
  } else if (!isValidEmail(value) && !isValidPhone(value)) {
    errors.emailOrPhone = "Email atau nomor HP tidak valid";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: {
      emailOrPhone: value,
      isEmail: isValidEmail(value),
      isPhone: isValidPhone(value),
      normalizedPhone: isValidPhone(value) ? normalizePhone(value) : null,
    },
  };
}