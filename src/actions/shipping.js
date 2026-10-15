"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) throw new Error("Belum login");
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) throw new Error("Bukan admin");
  return supabase;
}

function toInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export async function createShippingZone(formData) {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const method = String(formData.get("method") || "").trim();
  if (!name || !method) throw new Error("Nama dan metode wajib diisi");

  const { error } = await supabase.from("shipping_zones").insert({
    name,
    method,
    fee: Math.max(0, toInt(formData.get("fee"), 0)),
    sort_order: toInt(formData.get("sortOrder"), 0),
    is_active: formData.get("isActive") === "on",
  });
  if (error) throw new Error("Gagal menambah zona");

  revalidatePath("/admin/ongkir");
}

export async function updateShippingZone(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("ID zona kosong");

  const { error } = await supabase
    .from("shipping_zones")
    .update({
      name: String(formData.get("name") || "").trim(),
      method: String(formData.get("method") || "").trim(),
      fee: Math.max(0, toInt(formData.get("fee"), 0)),
      sort_order: toInt(formData.get("sortOrder"), 0),
      is_active: formData.get("isActive") === "on",
    })
    .eq("id", id);

  if (error) throw new Error("Gagal memperbarui zona");

  revalidatePath("/admin/ongkir");
}

export async function deleteShippingZone(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("ID zona kosong");

  const { error } = await supabase.from("shipping_zones").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus zona");

  revalidatePath("/admin/ongkir");
}