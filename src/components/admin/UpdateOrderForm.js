"use client";

import { useActionState } from "react";
import { ORDER_STATUS_LABEL } from "@/lib/constants";
import { updateOrder } from "@/actions/orders";

export default function UpdateOrderForm({ order, allowedNext }) {
  const [state, formAction, pending] = useActionState(updateOrder, null);

  return (
    <section className="rounded-lg bg-putih p-4 ring-1 ring-garis">
      <h2 className="font-serif text-lg font-semibold">Proses pesanan</h2>

      {state?.ok ? (
        <div
          role="status"
          className="mt-3 rounded-lg bg-ok-bg px-4 py-3 text-sm text-ok"
        >
          {state.message || "Perubahan tersimpan."}
        </div>
      ) : null}
      {state?.error ? (
        <div
          role="alert"
          className="mt-3 rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah"
        >
          {state.error}
        </div>
      ) : null}

      {allowedNext.length === 0 ? (
        <p className="mt-3 text-sm text-teks-sekunder">
          Status terminal, tidak ada transisi berikutnya.
        </p>
      ) : (
        <form action={formAction} className="mt-4 space-y-4">
          <input type="hidden" name="orderId" value={order.id} />
          <label className="block">
            <span className="text-sm font-medium">Ubah status</span>
            <select
              name="status"
              defaultValue={order.status}
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
            >
              <option value={order.status}>
                {ORDER_STATUS_LABEL[order.status]} (saat ini)
              </option>
              {allowedNext.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium">Kurir</span>
            <input
              name="courier"
              defaultValue={order.courier || ""}
              placeholder="JNE / J&T"
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Nomor resi</span>
            <input
              name="trackingNumber"
              defaultValue={order.tracking_number || ""}
              className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm font-mono"
            />
          </label>
          <button
            type="submit"
            disabled={pending}
            className={
              "inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold text-krem transition " +
              (pending
                ? "cursor-wait bg-zaitun/60"
                : "bg-zaitun hover:bg-zaitun-hover")
            }
          >
            {pending ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </form>
      )}
    </section>
  );
}
