# Panduan pemasangan (langkah manual)

Urutan ini dikerjakan sekali di awal. Semua memakai paket gratis dan Midtrans Sandbox.

## 1. Supabase

1. Buka https://supabase.com/dashboard, buat proyek baru. Region: **Singapore**. Simpan kata sandi database.
2. **SQL Editor** > New query > tempel seluruh `supabase/schema.sql` > Run.
3. Query baru > tempel seluruh `supabase/seed.sql` > Run. Hasil akhir harus: kategori 3, produk 8, opsi_ukuran 48, opsi_bahan 18, opsi_warna 48, zona_ongkir 7.
4. **Authentication > Users > Add user**: isi email dan kata sandi kuat, centang **Auto Confirm User**.
5. Daftarkan akun itu sebagai admin (ganti emailnya), jalankan di SQL Editor:
   ```sql
   insert into admins (user_id)
   select id from auth.users where email = 'GANTI_DENGAN_EMAIL_ADMIN'
   on conflict do nothing;
   ```
6. **Authentication > Sign In / Providers**: matikan "Allow new users to sign up".
7. Ambil kunci di **Project Settings > API** (atau menu API Keys; label bisa berbeda antarversi dashboard):
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - kunci anon/publishable → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - kunci service role/secret → `SUPABASE_SERVICE_ROLE_KEY` (**rahasia**, jangan dibagikan)
8. Setelah itu coba cek RLS dan Storage sungguhan: skema sudah diuji di PostgreSQL lokal, tetapi belum di Supabase asli.

## 2. Gmail (untuk email)

1. Akun Google > Keamanan > aktifkan **Verifikasi 2 langkah**.
2. Buka https://myaccount.google.com/apppasswords, buat App Password (16 karakter).
3. Isi `GMAIL_USER` (alamat Gmail) dan `GMAIL_APP_PASSWORD` (tanpa spasi). Gmail membatasi jumlah kiriman harian, cukup untuk MVP.

## 3. Midtrans Sandbox

1. Masuk ke dashboard Midtrans, ganti environment ke **Sandbox**.
2. **Settings > Access Keys**: salin Server Key → `MIDTRANS_SERVER_KEY` dan Client Key → `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`.
3. `MIDTRANS_IS_PRODUCTION=false`.
4. **Payment Notification URL** diisi nanti, setelah deploy pertama dan setelah rute webhook dibuat (Tahap 5): `https://DOMAIN-KAMU/api/midtrans/webhook`.

## 4. Variabel lingkungan lokal

```bash
cp .env.example .env.local
openssl rand -hex 32   # tempel hasilnya ke IP_HASH_SALT
```

Isi semua nilai di `.env.local`. Jangan commit berkas ini.

## 5. Jalankan lokal

```bash
npm install
npm run dev
```

Cek http://localhost:3000 (halaman sementara) dan http://localhost:3000/api/health (harus `{"ok":true}`). Jika `ok:false`, periksa URL dan kunci Supabase serta apakah `schema.sql` sudah dijalankan.

## 6. GitHub dan Vercel

1. Buat repositori GitHub (privat), lalu `git remote add origin ... && git push -u origin main`.
2. https://vercel.com/new > import repositori. Framework Next.js terdeteksi otomatis.
3. **Environment Variables**: isi semua variabel dari `.env.example` (nilai `NEXT_PUBLIC_SITE_URL` = alamat `*.vercel.app` proyekmu).
4. Deploy. Pastikan `/api/health` di alamat Vercel menjawab `{"ok":true}`.
5. Paket Hobby hanya untuk non-komersial. Naik ke Pro sebelum menerima pembayaran sungguhan (lihat GO_LIVE_CHECKLIST.md).

## 7. Supaya Supabase gratis tidak dijeda

Proyek gratis dijeda setelah 1 minggu tanpa aktivitas. Daftarkan `https://DOMAIN-KAMU/api/health` ke pemantau uptime gratis (misalnya UptimeRobot) dengan interval 5 menit.
