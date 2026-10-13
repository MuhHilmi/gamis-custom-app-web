// Route API untuk mengunggah foto produk ke bucket Supabase Storage
// "product-photos". Hanya admin (sesi Supabase Auth + is_admin()) yang boleh.
// Foto yang dihasilkan berupa kunci objek di bucket, sehingga dapat disimpan
// ke kolom products.photos dan ditampilkan lewat lib/storage.js.
import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { productPhotoUrl } from "@/lib/storage";

const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB, sesuai batas bucket

export async function POST(request) {
  // 1. Wajib login.
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const loggedIn = Boolean(claimsData?.claims) && !claimsError;
  if (!loggedIn) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  // 2. Wajib admin (RLS + pemeriksaan hak sendiri).
  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
  if (adminError || isAdmin !== true) {
    return NextResponse.json({ error: "Bukan admin" }, { status: 403 });
  }

  // 3. Ambil berkas dari form-data.
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Body tidak valid" }, { status: 400 });
  }
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Berkas foto wajib diisi (field 'file')" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Berkas kosong" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran foto melebihi 2 MB" }, { status: 400 });
  }
  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Tipe foto tidak didukung. Pakai JPEG, PNG, atau WebP." },
      { status: 400 }
    );
  }

  // 4. Nama berkas aman dan unik, jangan pakai nama asli pengguna.
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("product-photos")
    .upload(safeName, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("[photos] gagal unggah:", uploadError.message);
    return NextResponse.json({ error: "Gagal mengunggah foto" }, { status: 500 });
  }

  return NextResponse.json({
    path: safeName,
    url: productPhotoUrl(safeName),
  });
}
