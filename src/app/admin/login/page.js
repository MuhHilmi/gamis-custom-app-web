"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) {
      setError("Email atau kata sandi salah.");
      setLoading(false);
      return;
    }
    router.push("/admin/pesanan");
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-serif text-2xl font-semibold">Login admin</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
            autoComplete="username"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Kata sandi</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full min-h-11 rounded-lg border border-garis-input bg-putih px-4 py-2 text-sm"
            autoComplete="current-password"
          />
        </label>
        {error ? (
          <p className="rounded-lg bg-merah-bg px-4 py-3 text-sm text-merah">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-zaitun px-4 text-sm font-semibold text-krem hover:bg-zaitun-hover disabled:cursor-not-allowed disabled:bg-zaitun/45"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </section>
  );
}