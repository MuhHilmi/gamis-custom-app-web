// Next.js 16: proxy menggantikan middleware. Berkas ini harus berada di src/
// (sejajar dengan app/) karena proyek memakai folder src.
//
// Tugasnya hanya dua: menyegarkan sesi Supabase admin dan mengarahkan
// pengunjung yang belum login dari /admin ke halaman login. Ini pemeriksaan
// awal saja. Setiap Server Action admin tetap wajib memeriksa sesi dan
// is_admin() sendiri, dan RLS di database adalah penegak terakhir.
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getClaims memverifikasi JWT dan menyegarkan token bila perlu.
  const { data } = await supabase.auth.getClaims();
  const loggedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!loggedIn && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (loggedIn && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/pesanan";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

// Pembeli tidak memakai Supabase Auth, jadi proxy hanya berjalan di /admin.
export const config = {
  matcher: ["/admin/:path*"],
};
