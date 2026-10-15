import { NextResponse } from "next/server";
import { validateTrackInput } from "@/lib/validation";
import { checkRateLimit, extractClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const validation = validateTrackInput(body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: "Data tidak valid", errors: validation.errors },
      { status: 400 }
    );
  }

  const ip = extractClientIp(request);
  const rate = await checkRateLimit({ kind: "lacak", ip });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429 }
    );
  }

  const { orderCode, customerPhoneNorm } = validation.data;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Layanan belum siap" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("orders")
    .select("code")
    .eq("code", orderCode)
    .eq("customer_phone_norm", customerPhoneNorm)
    .maybeSingle();

  if (error) {
    console.error("[lacak] gagal cari pesanan:", error.message);
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Kode pesanan atau nomor HP tidak cocok." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, orderCode: data.code });
}