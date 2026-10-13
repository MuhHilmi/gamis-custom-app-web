// Pembatasan percobaan /lacak dan /lupa-kode per IP. Hanya hash IP yang
// disimpan (dengan IP_HASH_SALT), tidak IP asli. Tabel lookup_attempts
// dibaca/ditulis lewat service role.
import "server-only";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const RATE_LIMITS = {
  lacak: { limit: 10, windowMinutes: 15 },
  lupa_kode: { limit: 3, windowMinutes: 15 },
};

export function hashIp(ip, salt = process.env.IP_HASH_SALT || "") {
  return crypto.createHash("sha256").update(String(salt) + ":" + String(ip || "")).digest("hex");
}

export async function checkRateLimit({ kind, ip, limit, windowMinutes } = {}) {
  const preset = RATE_LIMITS[kind] || {};
  const finalLimit = limit ?? preset.limit ?? 10;
  const finalWindow = windowMinutes ?? preset.windowMinutes ?? 15;

  if (!kind) throw new Error("kind wajib diisi");
  const supabase = createAdminClient();
  const ipHash = hashIp(ip, process.env.IP_HASH_SALT || "");

  const windowStart = new Date(Date.now() - finalWindow * 60 * 1000).toISOString();

  const { count, error: countError } = await supabase
    .from("lookup_attempts")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("kind", kind)
    .gte("created_at", windowStart);

  if (countError) throw countError;

  const previous = count ?? 0;
  if (previous >= finalLimit) {
    return { allowed: false, remaining: 0, retryAfterMinutes: finalWindow };
  }

  const { error: insertError } = await supabase
    .from("lookup_attempts")
    .insert({ ip_hash: ipHash, kind });

  if (insertError) throw insertError;

  return { allowed: true, remaining: Math.max(0, finalLimit - previous - 1) };
}

export function extractClientIp(request) {
  const forwarded = request?.headers?.get?.("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request?.headers?.get?.("x-real-ip") || "unknown";
}