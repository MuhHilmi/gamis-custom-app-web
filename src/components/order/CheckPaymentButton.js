"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUS_LABEL } from "@/lib/constants";

export default function CheckPaymentButton({ orderCode }) {
  const router = useRouter();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function check() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/midtrans/webhook?order_id=${encodeURIComponent(orderCode)}`
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Gagal memeriksa status");
      }
      setStatus(data?.status || null);
      router.refresh();
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
        onClick={check}
        disabled={loading}
        className={
          "inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold text-krem transition " +
          (loading
            ? "cursor-wait bg-zaitun/60"
            : "bg-zaitun hover:bg-zaitun-hover")
        }
      >
        {loading ? "Memeriksa..." : "Periksa status pembayaran"}
      </button>
      {status ? (
        <p className="text-sm text-teks">
          Hasil pemeriksaan:{" "}
          <span className="font-medium">{ORDER_STATUS_LABEL[status] || status}</span>
        </p>
      ) : null}
      {error ? <p className="text-sm text-merah">{error}</p> : null}
    </div>
  );
}
