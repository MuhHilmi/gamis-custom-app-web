"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function PayNowButton({ token, orderCode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!token) return null;

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      await loadSnapScript();
      await new Promise((resolve, reject) => {
        window.snap.pay(token, {
          onSuccess: () => resolve(),
          onPending: () => resolve(),
          onError: () => reject(new Error("Pembayaran gagal. Coba lagi.")),
          onClose: () => resolve(),
        });
      });
      router.refresh();
      router.push(`/pesanan/${orderCode}`);
    } catch (err) {
      setError(err?.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover disabled:cursor-not-allowed disabled:bg-zaitun/45"
      >
        {loading ? "Memproses..." : "Bayar sekarang"}
      </button>
      {error ? <p className="text-xs text-merah">{error}</p> : null}
    </div>
  );
}