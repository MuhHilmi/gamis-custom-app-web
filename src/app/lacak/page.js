"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { isValidEmail, isValidPhone } from "@/lib/validation";

// Gaya dasar semua kolom input: transisi border halus + cincin fokus lembut.
const INPUT_BASE =
  "mt-1 block w-full min-h-11 rounded-lg border bg-putih px-4 py-2 text-sm transition duration-200 focus:outline-none focus:ring-2";
const INPUT_IDLE = "border-garis-input focus:border-zaitun focus:ring-zaitun/25";
const INPUT_VALID = "border-ok focus:border-ok focus:ring-ok/25";
const INPUT_INVALID = "border-merah focus:border-merah focus:ring-merah/25";

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z"
      />
    </svg>
  );
}

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

  // Umpan balik validasi untuk kolom "Email atau nomor HP".
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotShake, setForgotShake] = useState(false);

  const forgotTrimmed = forgotValue.trim();
  const forgotValid = isValidEmail(forgotTrimmed) || isValidPhone(forgotTrimmed);
  // Saat belum disentuh: hijau bila valid, netral selain itu. Setelah disentuh
  // (blur atau submit): hijau bila valid, merah bila tidak.
  const forgotState = !forgotTouched
    ? forgotTrimmed && forgotValid
      ? "valid"
      : "idle"
    : forgotValid
      ? "valid"
      : "invalid";

  const forgotInputClass = `${INPUT_BASE} ${
    forgotState === "valid"
      ? INPUT_VALID
      : forgotState === "invalid"
        ? INPUT_INVALID
        : INPUT_IDLE
  }${forgotShake ? " shake" : ""}`;

  function triggerForgotShake() {
    setForgotShake(false);
    window.requestAnimationFrame(() => setForgotShake(true));
  }

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
    if (!forgotValid) {
      setForgotTouched(true);
      triggerForgotShake();
      return;
    }
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
      <h1
        className="fade-up font-serif text-2xl font-semibold"
        style={{ "--fade-up-duration": "0.3s" }}
      >
        Lacak pesanan
      </h1>
      <p
        className="fade-up mt-2 text-sm text-teks-sekunder"
        style={{ "--fade-up-duration": "0.3s", "--fade-up-delay": "90ms" }}
      >
        Masukkan kode pesanan dan nomor HP untuk melihat status. Jika lupa kode,
        isi email atau nomor HP terdaftar.
      </p>

      <div className="mt-6 space-y-8">
        {/* Lacak */}
        <form
          onSubmit={handleTrack}
          noValidate
          className="fade-up space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis"
          style={{ "--fade-up-duration": "0.3s", "--fade-up-delay": "180ms" }}
        >
          <h2 className="font-serif text-lg font-semibold">Cari dengan kode</h2>
          <label className="block">
            <span className="text-sm font-medium">Kode pesanan</span>
            <input
              value={trackForm.orderCode}
              onChange={(e) => setTrackForm((p) => ({ ...p, orderCode: e.target.value }))}
              placeholder="GM-XXXXXXXXXX"
              className={`${INPUT_BASE} ${INPUT_IDLE} font-mono`}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Nomor HP</span>
            <input
              value={trackForm.customerPhone}
              onChange={(e) => setTrackForm((p) => ({ ...p, customerPhone: e.target.value }))}
              placeholder="081234567890"
              inputMode="tel"
              className={`${INPUT_BASE} ${INPUT_IDLE}`}
            />
          </label>
          {trackError ? (
            <p
              role="alert"
              className="fade-up rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah"
              style={{ "--fade-up-duration": "0.3s" }}
            >
              {trackError}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={trackSubmitting}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem transition duration-200 enabled:hover:scale-[1.02] enabled:hover:bg-zaitun-hover enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zaitun/45"
          >
            {trackSubmitting ? (
              <>
                <Spinner />
                Mencari...
              </>
            ) : (
              "Cari pesanan"
            )}
          </button>
        </form>

        {/* Lupa kode */}
        <form
          onSubmit={handleForgot}
          noValidate
          className="fade-up space-y-4 rounded-lg bg-putih p-4 ring-1 ring-garis"
          style={{ "--fade-up-duration": "0.3s", "--fade-up-delay": "280ms" }}
        >
          <h2 className="font-serif text-lg font-semibold">Lupa kode pesanan</h2>
          <label className="block">
            <span className="text-sm font-medium">Email atau nomor HP</span>
            <input
              value={forgotValue}
              onChange={(e) => setForgotValue(e.target.value)}
              onBlur={() => {
                setForgotTouched(true);
                if (forgotTrimmed && !forgotValid) triggerForgotShake();
              }}
              onAnimationEnd={() => setForgotShake(false)}
              aria-invalid={forgotState === "invalid"}
              placeholder="nama@email.com atau 081234567890"
              className={forgotInputClass}
            />
          </label>
          {forgotError ? (
            <p
              role="alert"
              className="fade-up rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah"
              style={{ "--fade-up-duration": "0.3s" }}
            >
              {forgotError}
            </p>
          ) : null}
          {forgotMessage ? (
            <p
              role="status"
              className="fade-up rounded-lg bg-ok-bg px-4 py-3 text-sm text-ok"
              style={{ "--fade-up-duration": "0.3s" }}
            >
              {forgotMessage}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={forgotSubmitting}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem transition duration-200 enabled:hover:scale-[1.02] enabled:hover:bg-zaitun-hover enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-zaitun/45"
          >
            {forgotSubmitting ? (
              <>
                <Spinner />
                Mengirim...
              </>
            ) : (
              "Kirim ulang kode"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-teks-sekunder">
        Kode pesanan bersifat rahasia. Jangan bagikan ke orang lain.
      </p>
      <p className="mt-2 text-xs text-teks-sekunder">
        <Link
          href="/katalog"
          className="inline-block text-zaitun underline-offset-2 transition duration-200 hover:-translate-y-0.5 hover:text-zaitun-hover hover:underline"
        >
          Kembali ke katalog
        </Link>
      </p>
    </section>
  );
}
