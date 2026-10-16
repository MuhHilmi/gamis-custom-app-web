"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatRupiah } from "@/lib/format";
import { subtotalOfLines, totalOf } from "@/lib/pricing";
import { validateCheckout } from "@/lib/validation";
import { PROVINSI_JAWA } from "@/lib/constants";

const CART_KEY = "gamis-cart";

function snapScriptSrc() {
  const isProd = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
  return isProd
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";
}

function loadSnapScript() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.snap) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-midtrans-snap='true']");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Gagal memuat Midtrans Snap")));
      return;
    }
    const script = document.createElement("script");
    script.src = snapScriptSrc();
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    script.setAttribute("data-midtrans-snap", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Gagal memuat Midtrans Snap"));
    document.head.appendChild(script);
  });
}

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [zones, setZones] = useState([]);
  const [zonesLoaded, setZonesLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [serverError, setServerError] = useState(null);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    address: "",
    city: "",
    province: "Jawa Barat",
    postalCode: "",
    note: "",
    shippingMethod: "kurir_darat",
    shippingZoneId: "",
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCartItems(readCart());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("shipping_zones")
        .select("id, name, method, fee, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (cancelled) return;
      if (!error) setZones(data || []);
      setZonesLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedZone = useMemo(
    () => zones.find((zone) => zone.id === form.shippingZoneId) || null,
    [zones, form.shippingZoneId]
  );

  const subtotal = useMemo(
    () => subtotalOfLines(cartItems.map((item) => ({ lineTotal: item.lineTotal }))),
    [cartItems]
  );
  const shippingFee = selectedZone ? selectedZone.fee : 0;
  const total = totalOf(subtotal, shippingFee);

  const filteredZones = useMemo(
    () => zones.filter((zone) => zone.method === form.shippingMethod),
    [zones, form.shippingMethod]
  );

  const errors = useMemo(() => {
    if (!loaded) return {};
    const validation = validateCheckout({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail,
      address: form.address,
      city: form.city,
      province: form.province,
      postalCode: form.postalCode,
      shippingMethod: form.shippingMethod,
      shippingZoneId: form.shippingZoneId,
      items: cartItems,
      note: form.note,
    });
    return validation.ok ? {} : validation.errors;
  }, [form, cartItems, loaded]);

  const canSubmit = loaded && cartItems.length > 0 && Object.keys(errors).length === 0;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "shippingMethod") next.shippingZoneId = "";
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setServerError(null);
    setMessage(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail,
          address: form.address,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
          shippingMethod: form.shippingMethod,
          shippingZoneId: form.shippingZoneId,
          items: cartItems,
          note: form.note,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Checkout gagal");
      }
      if (!data?.token || !data?.orderCode) {
        throw new Error("Token pembayaran tidak diterima");
      }

      await loadSnapScript();
      await new Promise((resolve, reject) => {
        window.snap.pay(data.token, {
          onSuccess: () => {
            router.push(`/pesanan/${data.orderCode}`);
            resolve();
          },
          onPending: () => {
            router.push(`/pesanan/${data.orderCode}`);
            resolve();
          },
          onError: () => reject(new Error("Pembayaran gagal. Coba lagi.")),
          onClose: () => resolve(),
        });
      });
    } catch (error) {
      setServerError(error?.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="font-serif text-2xl font-semibold">Checkout</h1>
        <p className="mt-4 text-sm text-teks-sekunder">Memuat checkout...</p>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-semibold">Checkout</h1>
        <p className="mt-4 text-sm text-teks-sekunder">Keranjangmu masih kosong</p>
        <Link
          href="/katalog"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-zaitun px-5 text-sm font-semibold text-krem hover:bg-zaitun-hover"
        >
          Lihat koleksi
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="font-serif text-2xl font-semibold">Checkout</h1>
      <p className="mt-1 text-sm text-teks-sekunder">
        Isi data penerima dan pilih pengiriman. Semua field wajib diisi.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        {/* Data penerima */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-base font-semibold">Data penerima</legend>
          <label className="block">
            <span className="text-sm font-medium">Nama lengkap</span>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
              autoComplete="name"
            />
            {errors.customerName ? (
              <p className="mt-1 text-xs text-merah">{errors.customerName}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Nomor HP</span>
            <input
              name="customerPhone"
              value={form.customerPhone}
              onChange={handleChange}
              inputMode="tel"
              placeholder="081234567890"
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
              autoComplete="tel"
            />
            {errors.customerPhone ? (
              <p className="mt-1 text-xs text-merah">{errors.customerPhone}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              name="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={handleChange}
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
              autoComplete="email"
            />
            {errors.customerEmail ? (
              <p className="mt-1 text-xs text-merah">{errors.customerEmail}</p>
            ) : null}
          </label>
        </fieldset>

        {/* Alamat */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-base font-semibold">Alamat</legend>
          <label className="block">
            <span className="text-sm font-medium">Alamat lengkap</span>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
              autoComplete="street-address"
            />
            {errors.address ? (
              <p className="mt-1 text-xs text-merah">{errors.address}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Kota/Kabupaten</span>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
              autoComplete="address-level2"
            />
            {errors.city ? (
              <p className="mt-1 text-xs text-merah">{errors.city}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Provinsi</span>
            <select
              name="province"
              value={form.province}
              onChange={handleChange}
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
            >
              {PROVINSI_JAWA.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {errors.province ? (
              <p className="mt-1 text-xs text-merah">{errors.province}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-medium">Kode pos (opsional)</span>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={5}
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
              autoComplete="postal-code"
            />
            {errors.postalCode ? (
              <p className="mt-1 text-xs text-merah">{errors.postalCode}</p>
            ) : null}
          </label>
        </fieldset>

        {/* Pengiriman */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-base font-semibold">Pengiriman</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "kurir_darat", label: "Kurir darat" },
              { value: "antar_langsung", label: "Antar langsung" },
            ].map((option) => {
              const active = form.shippingMethod === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, shippingMethod: option.value, shippingZoneId: "" }))
                  }
                  className={
                    "min-h-11 rounded-lg border px-3 text-sm font-medium transition " +
                    (active
                      ? "border-zaitun bg-zaitun text-krem"
                      : "border-garis-input bg-putih text-teks hover:border-zaitun")
                  }
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <label className="block">
            <span className="text-sm font-medium">Zona pengiriman</span>
            <select
              name="shippingZoneId"
              value={form.shippingZoneId}
              onChange={handleChange}
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
              disabled={!zonesLoaded}
            >
              <option value="">Pilih zona</option>
              {filteredZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} ({formatRupiah(zone.fee)})
                </option>
              ))}
            </select>
            {errors.shippingZoneId ? (
              <p className="mt-1 text-xs text-merah">{errors.shippingZoneId}</p>
            ) : null}
          </label>

          {selectedZone ? (
            <p className="text-sm text-teks-sekunder">
              Ongkir {selectedZone.name}: {formatRupiah(selectedZone.fee)}
            </p>
          ) : null}
        </fieldset>

        {/* Catatan pesanan */}
        <label className="block">
          <span className="text-sm font-medium">Catatan pesanan (opsional)</span>
          <textarea
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
          />
        </label>

        {/* Ringkasan */}
        <section className="rounded-lg bg-putih p-4 ring-1 ring-garis">
          <h2 className="font-serif text-base font-semibold">Ringkasan harga</h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-teks-sekunder">Subtotal</span>
              <span className="tabular-nums font-medium">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-teks-sekunder">Ongkos kirim</span>
              <span className="tabular-nums font-medium">{formatRupiah(shippingFee)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-garis pt-3">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold tabular-nums text-zaitun">{formatRupiah(total)}</span>
            </div>
          </div>
        </section>

        {serverError ? (
          <p className="rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah">{serverError}</p>
        ) : null}
        {message ? (
          <p className="rounded-lg bg-ok-bg px-4 py-3 text-sm text-ok">{message}</p>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className={
            "inline-flex min-h-12 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-krem transition " +
            (!canSubmit || submitting
              ? "cursor-not-allowed bg-zaitun/45"
              : "bg-zaitun shadow-sm hover:bg-zaitun-hover active:translate-y-px")
          }
        >
          {submitting ? "Memproses..." : "Lanjutkan checkout"}
        </button>
      </form>
    </section>
  );
}