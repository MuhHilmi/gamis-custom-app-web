"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) throw new Error("Belum login");
  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) throw new Error("Bukan admin");
  return supabase;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toInt(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

function parseSizeChart(text) {
  const raw = String(text || "").trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parsePhotos(text) {
  return String(text || "")
    .split(/[\n,]+/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function createProduct(formData) {
  const supabase = await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || name);
  if (!name || !slug) throw new Error("Nama/slug wajib diisi");

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description: String(formData.get("description") || "").trim() || null,
      material_info: String(formData.get("materialInfo") || "").trim() || null,
      base_price: Math.max(0, toInt(formData.get("basePrice"), 0)),
      photos: parsePhotos(formData.get("photos")),
      size_chart: parseSizeChart(formData.get("sizeChart")),
      lead_time_days: Math.max(1, toInt(formData.get("leadTimeDays"), 7)),
      category_id: String(formData.get("categoryId") || "").trim() || null,
      is_active: formData.get("isActive") === "on",
    })
    .select("id")
    .single();

  if (error || !data) throw new Error("Gagal membuat produk");

  revalidatePath("/admin/produk");
  redirect(`/admin/produk/${data.id}`);
}

export async function updateProduct(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("ID produk kosong");

  const name = String(formData.get("name") || "").trim();
  const slug = slugify(String(formData.get("slug") || "").trim() || name);
  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description: String(formData.get("description") || "").trim() || null,
      material_info: String(formData.get("materialInfo") || "").trim() || null,
      base_price: Math.max(0, toInt(formData.get("basePrice"), 0)),
      photos: parsePhotos(formData.get("photos")),
      size_chart: parseSizeChart(formData.get("sizeChart")),
      lead_time_days: Math.max(1, toInt(formData.get("leadTimeDays"), 7)),
      category_id: String(formData.get("categoryId") || "").trim() || null,
      is_active: formData.get("isActive") === "on",
    })
    .eq("id", id);

  if (error) throw new Error("Gagal memperbarui produk");

  revalidatePath("/admin/produk");
  revalidatePath(`/admin/produk/${id}`);
}

export async function addOption(formData) {
  const supabase = await requireAdmin();
  const productId = String(formData.get("productId") || "").trim();
  const type = String(formData.get("type") || "").trim();
  const name = String(formData.get("name") || "").trim();
  if (!productId || !type || !name) throw new Error("Data opsi tidak lengkap");

  const { error } = await supabase.from("product_options").insert({
    product_id: productId,
    type,
    name,
    price_delta: Math.max(0, toInt(formData.get("priceDelta"), 0)),
    swatch_hex: String(formData.get("swatchHex") || "").trim() || null,
    sort_order: toInt(formData.get("sortOrder"), 0),
    is_active: formData.get("isActive") === "on",
  });

  if (error) throw new Error("Gagal menambah opsi");

  revalidatePath(`/admin/produk/${productId}`);
}

export async function updateOption(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const productId = String(formData.get("productId") || "").trim();
  if (!id || !productId) throw new Error("Data opsi tidak lengkap");

  const name = String(formData.get("name") || "").trim();
  if (!name) throw new Error("Nama opsi wajib diisi");

  const { error } = await supabase
    .from("product_options")
    .update({
      type: String(formData.get("type") || "").trim(),
      name,
      price_delta: Math.max(0, toInt(formData.get("priceDelta"), 0)),
      swatch_hex: String(formData.get("swatchHex") || "").trim() || null,
      sort_order: toInt(formData.get("sortOrder"), 0),
      is_active: formData.get("isActive") === "on",
    })
    .eq("id", id);

  if (error) throw new Error("Gagal memperbarui opsi");

  revalidatePath(`/admin/produk/${productId}`);
}

export async function deleteOption(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const productId = String(formData.get("productId") || "").trim();
  if (!id) throw new Error("ID opsi kosong");

  const { error } = await supabase.from("product_options").delete().eq("id", id);
  if (error) throw new Error("Gagal menghapus opsi");

  if (productId) revalidatePath(`/admin/produk/${productId}`);
}

export async function toggleProductActive(formData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  const isActive = formData.get("isActive") === "true";
  if (!id) throw new Error("ID produk kosong");

  const { error } = await supabase
    .from("products")
    .update({ is_active: !isActive })
    .eq("id", id);
  if (error) throw new Error("Gagal mengubah status produk");

  revalidatePath("/admin/produk");
  revalidatePath(`/admin/produk/${id}`);
}

export async function addProductPhoto(formData) {
  const supabase = await requireAdmin();
  const productId = String(formData.get("productId") || "").trim();
  const path = String(formData.get("path") || "").trim();
  if (!productId || !path) throw new Error("Data foto kosong");

  const { data: product, error: findError } = await supabase
    .from("products")
    .select("photos")
    .eq("id", productId)
    .maybeSingle();
  if (findError || !product) throw new Error("Produk tidak ditemukan");

  const photos = Array.isArray(product.photos) ? [...product.photos, path] : [path];
  const { error } = await supabase.from("products").update({ photos }).eq("id", productId);
  if (error) throw new Error("Gagal menyimpan foto");

  revalidatePath(`/admin/produk/${productId}`);
}