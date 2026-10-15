"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendStatusChangedEmail } from "@/lib/email";
import { ADMIN_TRANSITIONS, ORDER_STATUS_LABEL } from "@/lib/constants";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) throw new Error("Belum login");
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) throw new Error("Bukan admin");
  return supabase;
}

export async function updateOrder(formData) {
  const supabase = await requireAdmin();

  const orderId = String(formData.get("orderId") || "").trim();
  if (!orderId) throw new Error("ID pesanan kosong");

  const nextStatus = String(formData.get("status") || "").trim();
  const courier = String(formData.get("courier") || "").trim() || null;
  const trackingNumber = String(formData.get("trackingNumber") || "").trim() || null;

  const { data: order, error: findError } = await supabase
    .from("orders")
    .select("id, code, status, customer_email")
    .eq("id", orderId)
    .maybeSingle();

  if (findError || !order) throw new Error("Pesanan tidak ditemukan");

  const updates = { courier, tracking_number: trackingNumber };

  if (nextStatus && nextStatus !== order.status) {
    const allowed = ADMIN_TRANSITIONS[order.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new Error("Transisi status tidak diizinkan");
    }
    updates.status = nextStatus;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (updateError) throw new Error("Gagal memperbarui pesanan");

  if (updates.status) {
    await sendStatusChangedEmail({
      to: order.customer_email,
      orderCode: order.code,
      status: ORDER_STATUS_LABEL[updates.status] || updates.status,
      courier,
      trackingNumber,
    }).catch(() => {});
  }

  revalidatePath(`/admin/pesanan/${orderId}`);
  revalidatePath("/admin/pesanan");
}