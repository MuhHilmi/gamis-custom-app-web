// Klien service role: MELEWATI SEMUA RLS. Hanya untuk empat route API publik
// (checkout, webhook Midtrans, lacak, lupa-kode). Jangan dipakai di panel
// admin (panel admin memakai sesi admin di bawah RLS) dan jangan diimpor dari
// komponen browser. "server-only" membuat build gagal bila itu terjadi.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diisi");
  }
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
