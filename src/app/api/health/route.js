// Pemantau uptime memanggil rute ini. Membaca satu baris dari database,
// sekaligus menjaga proyek Supabase gratis tidak dijeda saat sepi.
import { connection, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

export async function GET() {
  await connection(); // selalu dijalankan saat ada permintaan, tidak di-prerender

  try {
    const supabase = createPublicClient();
    const { error } = await supabase.from("categories").select("id").limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[health] database tidak terjangkau:", err?.message);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
