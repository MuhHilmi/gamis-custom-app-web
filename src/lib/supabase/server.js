// Klien untuk halaman server dan Server Actions yang membawa sesi pengguna
// (panel admin). Membaca cookie, jadi hanya boleh dipakai di dalam <Suspense>
// atau di luar fungsi "use cache". Untuk data katalog publik pakai public.js.
import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component yang tidak boleh menulis cookie.
            // Aman diabaikan: proxy.js yang menyegarkan sesi admin.
          }
        },
      },
    }
  );
}
