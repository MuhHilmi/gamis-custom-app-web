# Tech stack: toko gamis pria custom

Dokumen pendamping [PRD E-commerce Gamis Pria Custom](https://claude.ai/code/artifact/c991434b-a24a-408c-ace2-dd505ef87448). Skema database ada di `DATABASE_SCHEMA.md`.

Terakhir diperbarui: 13 Oktober 2026.

Prinsip: satu proyek, satu bahasa (JavaScript), supaya bisa dikerjakan seorang diri dalam 7 hari.

## 1. Ringkasan stack

| Kebutuhan | Pilihan | Catatan |
| --- | --- | --- |
| Framework tampilan dan server | Next.js (App Router) + JavaScript | Katalog dan detail produk dirender di server agar cepat dan ramah SEO |
| Styling | Tailwind CSS | Tailwind v4: token warna zaitun dan krem didefinisikan lewat `@theme` di `src/app/globals.css` (tanpa `tailwind.config.js`) |
| Database | Supabase (PostgreSQL) | Region Singapura |
| Login admin | Supabase Auth | Hanya akun admin; pembeli checkout sebagai tamu |
| Foto produk | Supabase Storage + `next/image` | Bucket `product-photos`; foto dikompres sebelum diunggah |
| Pembayaran | Midtrans Snap | Snap token dan webhook lewat route API Next.js; server key hanya di server |
| Notifikasi | Email + tautan `wa.me` | Email untuk konfirmasi, perubahan status, dan kirim ulang kode. WhatsApp API resmi ditunda ke versi 2 |
| Hosting | Vercel (**paket Pro untuk toko berjualan**) | Paket Hobby hanya untuk penggunaan non-komersial, jadi toko yang menerima pembayaran perlu Pro (sekitar US$20/bulan; cek harga terbaru). Supabase Pro (sekitar US$25/bulan) juga disarankan karena paket gratis dijeda setelah 1 minggu tanpa aktivitas dan tanpa backup. Total kira-kira US$45/bulan. Detail di [ARCHITECTURE.md](ARCHITECTURE.md) |

Jawaban untuk pertanyaan yang sudah muncul: Next.js dibangun di atas React, jadi semua komponen tetap ditulis dengan React. Next.js dipilih karena menyediakan route API (untuk Midtrans dan webhook), render di server (kecepatan dan SEO), dan optimasi gambar dalam satu proyek.

## 2. Keputusan terbuka

| Hal | Status | Dampak |
| --- | --- | --- |
| Pengirim email | **Belum diputuskan.** Domain gratis `*.vercel.app` tidak bisa dipakai sebagai pengirim di Resend, karena Resend mewajibkan domain milik sendiri yang diverifikasi ([dokumentasi Resend](https://resend.com/docs/dashboard/domains/introduction)) | Tanpa itu email konfirmasi, kabar status, dan kirim ulang kode (F13) tidak sampai ke pembeli |

Pilihan yang tersedia:

1. Beli domain sendiri, lalu verifikasi di Resend. Paling rapi, dan domain itu sekaligus jadi alamat toko.
2. Pakai SMTP Gmail lewat Nodemailer. Gratis dan tanpa domain, tapi ada batas kiriman harian dan email datang dari alamat Gmail pribadi.

Selama belum diputuskan, alur utama tetap jalan: kode pesanan tampil di halaman konfirmasi, dan admin bisa mengirim tautan status lewat WhatsApp.

## 3. Batas paket gratis Supabase

Berdasarkan [halaman harga Supabase](https://supabase.com/pricing) yang dibuka pada 12 Oktober 2026. Batas dan harga bisa berubah, jadi cek ulang sebelum memutuskan.

| Aspek | Paket gratis | Paket Pro (mulai $25/bulan) |
| --- | --- | --- |
| Database | 500 MB per proyek | 8 GB per proyek |
| Penyimpanan file | 1 GB | 100 GB |
| Egress | 5 GB | 250 GB |
| Jeda otomatis | Setelah 1 minggu tanpa aktivitas | Tidak pernah |
| Backup otomatis | Tidak ada | Harian, disimpan 7 hari |
| Proyek aktif | Maksimal 2 | Proyek pertama termasuk |

Untuk toko ini, ukuran data aman di paket gratis. Risiko utamanya adalah jeda otomatis dan tidak adanya backup. Sebelum menerima pesanan sungguhan, pertimbangkan Pro. Jika tetap gratis, ambil backup manual berkala (ekspor lewat dashboard atau `pg_dump`) dan jangan biarkan proyek sepi lebih dari seminggu.

## 4. Struktur proyek

Satu repositori Next.js (App Router) dengan folder `src/`. Halaman pembeli, panel admin, dan route API hidup di proyek yang sama.

```
gamis-custom/
├── .env.local                  # kunci rahasia, jangan di-commit
├── jsconfig.json               # alias impor "@/" ke src/
├── next.config.mjs             # domain gambar Supabase untuk next/image
├── postcss.config.mjs          # plugin @tailwindcss/postcss (Tailwind v4)
├── package.json
├── proxy.js                    # (Next.js 16: pengganti middleware) lindungi /admin, segarkan sesi Supabase
├── supabase/
│   ├── schema.sql              # tabel, enum status, trigger, kebijakan RLS
│   └── seed.sql                # data contoh: produk, opsi, zona ongkir
├── public/
│   └── panduan-ukuran.png      # gambar cara mengukur
└── src/
    ├── app/
    │   ├── layout.js           # font, header, bar bawah mobile
    │   ├── globals.css
    │   ├── page.js             # beranda + katalog (F1)
    │   ├── produk/[slug]/page.js        # detail + form kustomisasi (F2, F3)
    │   ├── keranjang/page.js            # keranjang (F4)
    │   ├── checkout/page.js             # data penerima + ongkir (F5, F10)
    │   ├── pesanan/[kode]/page.js       # konfirmasi, status, linimasa, resi (F7, F12)
    │   ├── lacak/page.js                # cari pesanan: kode + HP, lupa kode (F12, F13)
    │   ├── admin/
    │   │   ├── layout.js                # menu admin
    │   │   ├── login/page.js
    │   │   ├── pesanan/page.js          # daftar + cari kode/nama/HP (F8)
    │   │   ├── pesanan/[id]/page.js     # detail ukuran, ubah status, resi
    │   │   ├── produk/page.js           # daftar produk (F9)
    │   │   ├── produk/[id]/page.js      # edit produk, opsi, harga opsi
    │   │   └── ongkir/page.js           # tarif per wilayah (F10)
    │   └── api/
    │       ├── checkout/route.js        # hitung ulang harga, simpan order, buat Snap token
    │       ├── midtrans/webhook/route.js # terima notifikasi bayar (F6)
    │       ├── lacak/route.js           # cek kode + HP, kembalikan status (F12)
    │       └── lupa-kode/route.js       # kirim ulang kode ke email (F13)
    ├── actions/                # Server Actions untuk panel admin
    │   ├── auth.js             # login, logout
    │   ├── orders.js           # ubah status, isi resi
    │   ├── products.js         # tambah/ubah produk dan opsi
    │   └── shipping.js         # ubah tarif zona
    ├── components/
    │   ├── ui/                 # Button, Input, Select, Badge, Swatch
    │   ├── layout/             # Header, Footer, StickyCta
    │   ├── catalog/            # ProductCard, CategoryFilter
    │   ├── product/            # Gallery, CustomizationForm, SizeGuide, PriceSummary
    │   ├── cart/               # CartItem, CartSummary
    │   ├── checkout/           # CheckoutForm, ShippingSelect, PayButton
    │   ├── order/              # StatusTimeline, ShippingInfo, TrackForm, ForgotCodeForm
    │   └── admin/              # OrderTable (dengan pencarian), StatusSelect, ProductForm, OptionEditor, WaLinkButton
    ├── context/
    │   └── CartContext.js      # keranjang + kode pesanan terakhir di localStorage
    └── lib/
        ├── supabase/
        │   ├── client.js       # untuk komponen browser (kunci anon)
        │   ├── server.js       # untuk halaman server (sesi pengguna)
        │   └── admin.js        # service role, hanya di route API
        ├── pricing.js          # hitung harga dari produk + pilihan (dipakai browser dan server)
        ├── validation.js       # validasi form dan body API, normalisasi nomor HP (0812 → 62812)
        ├── midtrans.js         # buat transaksi, verifikasi signature webhook
        ├── email.js            # kirim email: konfirmasi, perubahan status, kirim ulang kode
        ├── rate-limit.js       # batasi percobaan /lacak dan /lupa-kode per IP (hash IP)
        ├── whatsapp.js         # susun tautan wa.me berisi ringkasan pesanan
        ├── format.js           # format rupiah dan tanggal
        └── constants.js        # status pesanan, daftar wilayah Jawa
```

## 5. Rute dan fitur

ID fitur (F1 dan seterusnya) merujuk ke tabel kebutuhan fungsional di PRD.

| Rute | Fitur | Dikerjakan |
| --- | --- | --- |
| `/` | Katalog dan filter kategori (F1) | Hari 2 |
| `/produk/[slug]` | Detail dan form kustomisasi (F2, F3) | Hari 2–3 |
| `/keranjang` | Keranjang (F4) | Hari 3 |
| `/checkout` | Checkout tamu dan pilihan pengiriman (F5, F10) | Hari 4 |
| `/pesanan/[kode]` | Konfirmasi dan status pesanan: linimasa, estimasi, resi (F7, F12) | Hari 4 |
| `/api/checkout` dan `/api/midtrans/webhook` | Pembayaran Midtrans (F6) | Hari 5 |
| `/admin/pesanan` | Panel admin pesanan dengan pencarian (F8) | Hari 5 |
| `/admin/produk` dan `/admin/ongkir` | Kelola produk, harga, dan tarif (F9, F10) | Hari 6 |
| `/lacak` | Cari pesanan lewat kode + nomor HP (F12) dan form lupa kode (F13) | Hari 6–7 |
| `/api/lacak` dan `/api/lupa-kode` | Cek kode + HP, kirim ulang kode ke email, batas percobaan per IP (F12, F13) | Hari 6–7 |

## 6. Alur pembayaran Midtrans

1. Pembeli menekan bayar di `/checkout`. Browser mengirim isi keranjang dan data penerima ke `/api/checkout`.
2. Server menghitung ulang harga dari database (bukan dari angka di browser), menyimpan pesanan berstatus `menunggu_pembayaran`, lalu meminta Snap token ke Midtrans.
3. Browser membuka jendela Snap memakai token tersebut dan pembeli membayar.
4. Midtrans memanggil `/api/midtrans/webhook`. Server memverifikasi signature, lalu mengubah status menjadi `dibayar`. Hanya jalur ini yang boleh mengubah status ke `dibayar`.
5. Trigger database mengisi `paid_at` dan `estimated_ready_at`, serta mencatat riwayat di `order_events`.
6. Pembeli diarahkan ke `/pesanan/[kode]`, dan email konfirmasi dikirim (setelah keputusan pengirim email di bagian 2).

Selama pembangunan gunakan Midtrans Sandbox. Ajukan akun merchant di hari 1 karena verifikasinya bisa memakan waktu berhari-hari.

## 7. Status pesanan

`menunggu_pembayaran` → `dibayar` → `diproses` → `dikerjakan` → `dikirim` → `selesai`, ditambah `kedaluwarsa` dan `dibatalkan`.

| Status di database | Label untuk pembeli |
| --- | --- |
| `menunggu_pembayaran` | Menunggu pembayaran |
| `dibayar` | Pembayaran diterima |
| `diproses` | Pesanan dikonfirmasi admin |
| `dikerjakan` | Gamis sedang dijahit |
| `dikirim` | Dalam pengiriman |
| `selesai` | Pesanan selesai |
| `kedaluwarsa`, `dibatalkan` | Pesanan dibatalkan |

## 8. Variabel lingkungan

Isi di `.env.local` untuk pengembangan dan di pengaturan proyek Vercel untuk produksi. Variabel berawalan `NEXT_PUBLIC_` ikut terkirim ke browser, jadi jangan pernah dipakai untuk rahasia.

| Variabel | Dipakai di | Rahasia? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser dan server | Tidak |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser dan server | Tidak (dibatasi RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Hanya route API | Ya |
| `MIDTRANS_SERVER_KEY` | Hanya route API | Ya |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Browser (Snap) | Tidak |
| `MIDTRANS_IS_PRODUCTION` | Server | Tidak |
| `RESEND_API_KEY` | Hanya route API | Ya (jika memakai Resend) |
| `IP_HASH_SALT` | Hanya route API | Ya |
| `NEXT_PUBLIC_SITE_URL` | Browser dan server | Tidak |
| `NEXT_PUBLIC_ADMIN_WA` | Browser (tautan `wa.me`) | Tidak |

## 9. Aturan teknis dan keamanan

- Total harga selalu dihitung ulang di server sebelum membuat transaksi Midtrans. Angka dari browser tidak dipercaya.
- `lib/pricing.js` dipakai bersama oleh browser (menampilkan harga langsung) dan server (menghitung ulang), sehingga harga yang dilihat dan yang ditagih memakai aturan yang sama.
- Karena memakai JavaScript tanpa pengecekan tipe, semua input form dan body API divalidasi di server lewat `lib/validation.js`.
- Kunci `SUPABASE_SERVICE_ROLE_KEY` melewati semua aturan RLS, jadi hanya boleh dipakai di route API dan Server Actions, tidak pernah di komponen browser.
- Admin adalah satu akun Supabase Auth. `proxy.js` dan tiap Server Action memeriksa sesi admin sebelum mengubah data.
- Halaman `/pesanan/[kode]` dan `/lacak` hanya menampilkan nama, ringkasan pesanan, status, estimasi, dan resi. Alamat lengkap tidak ditampilkan (hanya kota dan provinsi).
- Jawaban `/lupa-kode` selalu sama baik data ada maupun tidak, dan kode hanya dikirim ke email yang tercatat di pesanan.
- Percobaan `/lacak` dan `/lupa-kode` dibatasi per IP lewat tabel `lookup_attempts`. Yang disimpan hanya hash IP (dengan `IP_HASH_SALT`), bukan IP asli.
- Keranjang disimpan di `localStorage` browser. Data ini hanya kemudahan, bukan sumber kebenaran.

## 10. Urutan membuat proyek (hari 1–2)

1. `npx create-next-app@latest` dengan opsi JavaScript, Tailwind, App Router, dan folder `src/`.
2. Buat proyek Supabase (region Singapura), jalankan `schema.sql` lalu `seed.sql`, dan buat satu akun admin (langkah manualnya ada di `DATABASE_SCHEMA.md`).
3. Pasang `@supabase/ssr` dan `@supabase/supabase-js`, isi `.env.local`, dan buat tiga klien di `lib/supabase/`.
4. Hubungkan repositori ke Vercel, isi variabel lingkungan, dan pastikan deploy pertama berjalan sebelum menulis fitur.
5. Atur token warna dan font di `src/app/globals.css` (blok `@theme`), lalu bangun `layout.js` dan katalog (F1).

## 11. Alternatif yang dipertimbangkan

| Alternatif | Kenapa tidak dipilih |
| --- | --- |
| React polos (Vite) + backend terpisah | Perlu merakit sendiri backend untuk Midtrans dan webhook, dan SEO per produk lebih lemah |
| Laravel + Filament (PHP) | Panel admin bisa jadi sangat cepat, tapi tampilan publik tetap dibangun sendiri dan hosting diatur manual. Layak dipertimbangkan hanya jika lebih menguasai PHP |
| Aiven (database terkelola) | Hanya menyediakan database; login admin dan penyimpanan foto harus dibuat atau dicari sendiri, menambah pekerjaan di jadwal yang padat |
| TypeScript | Lebih aman, tetapi dipilih JavaScript agar lebih cepat dikerjakan. Risikonya ditutup dengan validasi di server |

## Dokumen terkait

- [ARCHITECTURE.md](ARCHITECTURE.md): alur sistem, batas kepercayaan, webhook
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md): tabel dan RLS
- [UI_UX_SPEC.md](UI_UX_SPEC.md): desain, layar, komponen
