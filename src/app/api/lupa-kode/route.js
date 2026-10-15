import { NextResponse } from "next/server";
import { validateForgotCodeInput } from "@/lib/validation";
import { checkRateLimit, extractClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendForgotCodeEmail } from "@/lib/email";

const SAME_MESSAGE = "Jika data terdaftar, kode pesanan telah dikirim ke email yang tersimpan.";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }

  const validation = validateForgotCodeInput(body);
  if (!validation.ok) {
    return NextResponse.json(
      { error: "Data tidak valid", errors: validation.errors },
      { status: 400 }
    );
  }

  const ip = extractClientIp(request);
  const rate = await checkRateLimit({ kind: "lupa_kode", ip });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi nanti." },
      { status: 429 }
    );
  }

  const { emailOrPhone, isEmail, isPhone, normalizedPhone } = validation.data;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json({ message: SAME_MESSAGE });
  }

  try {
    let query = supabase
      .from("orders")
      .select("code, customer_email")
      .order("created_at", { ascending: false })
      .limit(1);

    if (isEmail) {
      query = query.ilike("customer_email", emailOrPhone.trim());
    } else if (isPhone && normalizedPhone) {
      query = query.eq("customer_phone_norm", normalizedPhone);
    }

    const { data } = await query.maybeSingle();

    if (data?.customer_email) {
      await sendForgotCodeEmail({
        to: data.customer_email,
        orderCode: data.code,
      }).catch(() => {});
    }
  } catch (err) {
    console.error("[lupa-kode] kesalahan:", err?.message);
  }

  // Jawaban selalu sama, baik data ada maupun tidak.
  return NextResponse.json({ ok: true, message: SAME_MESSAGE });
}