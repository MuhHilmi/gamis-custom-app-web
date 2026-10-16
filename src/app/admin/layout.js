import { logout } from "@/actions/auth";
import { createClient } from "@/lib/supabase/server";
import AdminNavLinks from "@/components/layout/AdminNavLinks";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  let isAdmin = false;
  if (claimsData?.claims) {
    const { data } = await supabase.rpc("is_admin");
    isAdmin = data === true;
  }

  return (
    <div className="min-h-screen bg-krem">
      {isAdmin ? (
        <header className="bg-zaitun text-krem">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <span className="font-serif text-xl font-semibold">Admin</span>
            <div className="flex items-center gap-2 text-sm">
              <AdminNavLinks />
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center rounded-lg px-3 hover:bg-red-800"
                >
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </header>
      ) : null}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}