# Checklist sebelum go-live

Selama pengembangan semuanya memakai data dummy, paket gratis, dan Midtrans Sandbox. **Jangan menerima pembayaran sungguhan sebelum semua poin ini selesai.**

## Data toko (ganti dari dummy)
- [ ] Nama toko dan logo (`src/lib/constants.js`, header, hero, email, judul halaman)
- [ ] Foto produk asli, minimal 3 sudut per produk (unggah lewat admin, bukan Picsum)
- [ ] Tabel ukuran asli per model (`products.size_chart`; sekarang ukuran universal)
- [ ] Deskripsi dan perawatan bahan asli
- [ ] Harga dasar, tambahan harga ukuran dan bahan, lead time per produk
- [ ] Tarif ongkir dan nama zona antar langsung (`/admin/ongkir`)
- [ ] Kebijakan pembatalan, pengembalian, dan perubahan alamat (footer, detail produk, checkout)
- [ ] Nomor WhatsApp admin asli (`NEXT_PUBLIC_ADMIN_WA`)
- [ ] Sapaan "kamu" atau "Anda" diputuskan dan diseragamkan

## Hosting dan database
- [ ] Naik ke **Vercel Pro**. Paket Hobby hanya untuk penggunaan non-komersial dan toko ini menerima pembayaran
- [ ] **Supabase Pro**, atau backup manual terjadwal (paket gratis tanpa backup dan bisa dijeda)
- [ ] Pemantau uptime aktif pada `/` dan `/api/health`
- [ ] Ekspor database (backup) sebelum rilis
- [ ] Hapus baris uji: pesanan dan akun uji
- [ ] Pertimbangkan domain sendiri (alamat toko dan pengirim email)

## Pembayaran
- [ ] Ajukan dan selesaikan verifikasi merchant Midtrans
- [ ] Ganti ke kunci **Production** (`MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`) dan `MIDTRANS_IS_PRODUCTION=true` di Vercel
- [ ] Isi **Payment Notification URL** di dashboard Production: `https://DOMAIN/api/midtrans/webhook`
- [ ] Aktifkan hanya metode pembayaran yang siap ditangani admin
- [ ] Uji **satu pembayaran sungguhan** (nilai kecil) sampai status pesanan menjadi `dibayar`
- [ ] Cocokkan pesanan `dibayar` dengan laporan di dashboard Midtrans pada minggu pertama

## Email
- [ ] Kirim email uji: konfirmasi pesanan, perubahan status, kirim ulang kode. Cek folder spam
- [ ] Pastikan batas kiriman harian Gmail masih cukup, atau pindah ke domain sendiri (Resend)

## Keamanan
- [ ] `SUPABASE_SERVICE_ROLE_KEY`, `MIDTRANS_SERVER_KEY`, `GMAIL_APP_PASSWORD`, `IP_HASH_SALT` hanya ada di Vercel dan `.env.local`, tidak di repositori
- [ ] Pendaftaran publik Supabase Auth dimatikan
- [ ] Uji RLS di Supabase asli: anon tidak bisa membaca `orders`, `order_items`, `admins`; produk nonaktif tidak terlihat
- [ ] Uji bucket `product-photos`: hanya admin yang bisa mengunggah
- [ ] Uji login admin dan semua Server Action admin menolak pengguna yang bukan admin
