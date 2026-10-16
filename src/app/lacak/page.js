"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TrackPage() {
  const router = useRouter();

  const [trackForm, setTrackForm] = useState({ orderCode: "", customerPhone: "" });
  const [forgotValue, setForgotValue] = useState("");
  const [trackMessage, setTrackMessage] = useState(null);
  const [forgotMessage, setForgotMessage] = useState(null);
  const [trackError, setTrackError] = useState(null);
  const [forgotError, setForgotError] = useState(null);
  const [trackSubmitting, setTrackSubmitting] = useState(false);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  async function handleTrack(event) {
    event.preventDefault();
    setTrackSubmitting(true);
    setTrackError(null);
    setTrackMessage(null);
    try {
      const response = await fetch("/api/lacak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderCode: trackForm.orderCode,
          customerPhone: trackForm.customerPhone,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Gagal mencari pesanan");
      }
      router.push(`/pesanan/${data.orderCode}`);
    } catch (err) {
      setTrackError(err?.message || "Terjadi kesalahan");
    } finally {
      setTrackSubmitting(false);
    }
  }

  async function handleForgot(event) {
    event.preventDefault();
    setForgotSubmitting(true);
    setForgotError(null);
    setForgotMessage(null);
    try {
      const response = await fetch("/api/lupa-kode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: forgotValue }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Gagal mengirim kode");
      }
      setForgotMessage(data?.message || "Jika data terdaftar, kode pesanan telah dikirim.");
    } catch (err) {
      setForgotError(err?.message || "Terjadi kesalahan");
    } finally {
      setForgotSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="font-serif text-2xl font-semibold">Lacak pesanan</h1>
      <p className="mt-2 text-sm text-teks-sekunder">
        Masukkan kode pesanan dan nomor HP untuk melihat status. Jika lupa kode,
        isi email atau nomor HP terdaftar.
      </p>

      <div className="mt-6 space-y-8">
        {/* Lacak */}
        <form onSubmit={handleTrack} noValidate className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <h2 className="font-serif text-lg font-semibold">Cari dengan kode</h2>
          <label className="block">
            <span className="text-sm font-medium">Kode pesanan</span>
            <input
              value={trackForm.orderCode}
              onChange={(e) => setTrackForm((p) => ({ ...p, orderCode: e.target.value }))}
              placeholder="GM-XXXXXXXXXX"
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm font-mono"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Nomor HP</span>
            <input
              value={trackForm.customerPhone}
              onChange={(e) => setTrackForm((p) => ({ ...p, customerPhone: e.target.value }))}
              placeholder="081234567890"
              inputMode="tel"
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
            />
          </label>
          {trackError ? (
            <p className="rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah">{trackError}</p>
          ) : null}
          <button
            type="submit"
            disabled={trackSubmitting}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover disabled:cursor-not-allowed disabled:bg-zaitun/45"
          >
            {trackSubmitting ? "Mencari..." : "Cari pesanan"}
          </button>
        </form>

        {/* Lupa kode */}
        <form onSubmit={handleForgot} noValidate className="space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis">
          <h2 className="font-serif text-lg font-semibold">Lupa kode pesanan</h2>
          <label className="block">
            <span className="text-sm font-medium">Email atau nomor HP</span>
            <input
              value={forgotValue}
              onChange={(e) => setForgotValue(e.target.value)}
              placeholder="nama@email.com atau 081234567890"
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
            />
          </label>
          {forgotError ? (
            <p className="rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah">{forgotError}</p>
          ) : null}
          {forgotMessage ? (
            <p className="rounded-lg bg-ok-bg px-4 py-3 text-sm text-ok">{forgotMessage}</p>
          ) : null}
          <button
            type="submit"
            disabled={forgotSubmitting}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover disabled:cursor-not-allowed disabled:bg-zaitun/45"
          >
            {forgotSubmitting ? "Mengirim..." : "Kirim ulang kode"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-teks-sekunder">
        Kode pesanan bersifat rahasia. Jangan bagikan ke orang lain.
      </p>
      <p className="mt-2 text-xs text-teks-sekunder">
        <Link href="/katalog" className="text-zaitun hover:underline">
          Kembali ke katalog
        </Link>
      </p>
    </section>
  );
}