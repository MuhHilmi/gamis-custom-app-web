// Klien anon TANPA cookie dan tanpa sesi, untuk membaca katalog publik
// (kategori, produk, opsi, zona ongkir). Karena tidak menyentuh cookie, aman
// dipakai di dalam fungsi "use cache" (Cache Components).
// RLS tetap berlaku: anon hanya melihat baris yang is_active.
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
