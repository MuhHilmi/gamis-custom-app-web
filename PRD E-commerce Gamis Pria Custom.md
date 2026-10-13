# PRD E-commerce Gamis Pria Custom

Oct 12, 2026 · @Kazuhiko

Web e-commerce mobile-first untuk pembeli yang mencari gamis pria custom, dirilis sebagai MVP dalam 7 hari, tenggat Oct 19, 2026.

## Ringkasan & tujuan

MVP ini harus bisa menerima pesanan gamis pria custom lewat HP dalam 7 hari, jadi fitur dipangkas ke satu alur beli yang tuntas: lihat produk, pilih kustomisasi, checkout, bayar.

**Masalah.** Pembeli gamis pria custom sulit menemukan penjual yang jelas soal ukuran, bahan, dan lama pengerjaan. Pemesanan lewat chat sering lambat dan rawan salah ukuran.

**Tujuan MVP:**

- Pembeli bisa memesan gamis custom sampai selesai pembayaran tanpa bantuan admin.
- Detail kustomisasi (ukuran, bahan, warna, catatan) tersimpan rapi di pesanan.
- Penjual/admin bisa melihat dan memproses pesanan masuk.
- Halaman terasa cepat dan nyaman di layar HP.
- Pembeli bisa memantau progres pesanan dan menemukan kembali kode pesanan tanpa membuat akun.

## Pengguna & kebutuhan

Pengguna utama adalah pria dewasa yang mencari gamis dengan ukuran dan model sesuai keinginan, dan hampir semuanya mengakses dari HP.

| Pengguna | Kebutuhan utama | Hambatan saat ini |
| --- | --- | --- |
| Pembeli gamis pria custom | Memilih model, bahan, warna, dan ukuran sendiri | Panduan ukuran tidak jelas, harga dan lama pengerjaan tidak transparan |
| Pembeli untuk acara (Idulfitri, pernikahan, seragam) | Kepastian tanggal selesai | Tidak tahu apakah pesanan sempat selesai sebelum acara |
| Admin/penjual | Menerima pesanan beserta detail kustomisasi | Detail tersebar di chat dan mudah terlewat |

**User stories utama:**

- Sebagai pembeli, saya ingin melihat katalog gamis di HP agar bisa membandingkan model dengan cepat.
- Sebagai pembeli, saya ingin memilih ukuran, bahan, dan warna agar gamis sesuai kebutuhan saya.
- Sebagai pembeli, saya ingin tahu estimasi harga dan lama pengerjaan sebelum membayar.
- Sebagai pembeli, saya ingin membayar dengan metode yang saya biasa pakai.
- Sebagai admin, saya ingin melihat daftar pesanan dan detail ukurannya agar bisa langsung dikerjakan.
- Sebagai pembeli, saya ingin melihat progres pesanan dan menemukan kembali kode pesanan jika lupa, tanpa harus membuat akun.
- Sebagai admin, saya ingin mencari pesanan berdasarkan kode, nama, atau nomor HP agar bisa membantu pembeli yang lupa kode.

## Ruang lingkup MVP

Dengan waktu 7 hari, hanya fitur yang dibutuhkan untuk satu pesanan tuntas yang masuk rilis pertama; sisanya ditunda ke versi berikutnya.

| Masuk MVP | Ditunda (versi 2) |
| --- | --- |
| Katalog dan halaman detail produk | Akun pengguna dan riwayat pesanan lengkap |
| Form kustomisasi (ukuran, bahan, warna, catatan) | Ulasan dan rating produk |
| Keranjang dan checkout sebagai tamu | Kode promo dan voucher |
| Pembayaran lewat Midtrans | Pelacakan pengiriman otomatis |
| Panel admin sederhana untuk melihat dan mengubah status pesanan | Aplikasi mobile native |
| Notifikasi pesanan lewat email dan tautan WhatsApp (wa.me) | Pengukuran ukuran dengan foto/AI |
| Halaman status pesanan dan pencarian pesanan (kode + nomor HP) | Verifikasi OTP lewat SMS/WhatsApp untuk pelacakan pesanan |

## Alur pengguna

Alur pembeli sengaja dibuat lurus dan tanpa wajib daftar, supaya sedikit orang yang berhenti di tengah jalan.

1. Pembeli membuka beranda atau katalog lewat HP.
2. Pembeli memilih gamis dan membuka halaman detail (foto, bahan, harga dasar, estimasi pengerjaan).
3. Pembeli mengisi kustomisasi: ukuran (dengan panduan), bahan, warna, dan catatan.
4. Pembeli menambahkan ke keranjang dan melihat ringkasan harga.
5. Pembeli mengisi data penerima dan alamat, lalu memilih pengiriman.
6. Pembeli membayar, lalu menerima halaman konfirmasi dan email berisi kode pesanan beserta tautan status.
7. Admin menerima pesanan, mengubah status (diproses, dikerjakan, dikirim) dan mengisi resi; perubahan tampil di halaman status dan dikabarkan lewat email.
8. Pembeli memantau progres lewat tautan status atau halaman Lacak pesanan (kode pesanan + nomor HP); jika lupa kode, kode dikirim ulang ke email yang dipakai saat checkout.

## Kebutuhan fungsional

P0 wajib selesai sebelum rilis; P1 dikerjakan hanya jika waktu tersisa.

| ID | Fitur | Kriteria penerimaan | Prioritas |
| --- | --- | --- | --- |
| F1 | Katalog produk | Daftar gamis tampil dengan foto, nama, harga dasar; bisa difilter berdasarkan kategori | P0 |
| F2 | Detail produk | Menampilkan galeri foto, deskripsi bahan, tabel ukuran, estimasi pengerjaan | P0 |
| F3 | Form kustomisasi | Pembeli memilih ukuran, bahan, warna, dan mengisi catatan; harga langsung muncul sesuai pilihan dan aturan harga yang diatur admin | P0 |
| F4 | Keranjang | Tambah, ubah jumlah, hapus item; total harga terhitung benar | P0 |
| F5 | Checkout tamu | Mengisi nama, nomor HP, email, dan alamat; semua wajib dan divalidasi; email dipakai untuk konfirmasi dan kirim ulang kode pesanan | P0 |
| F6 | Pembayaran | Pembayaran lewat Midtrans (Snap); status pesanan diperbarui otomatis lewat webhook | P0 |
| F7 | Konfirmasi pesanan | Halaman dan email konfirmasi berisi kode pesanan, ringkasan, dan tautan ke halaman status | P0 |
| F8 | Panel admin | Login admin, daftar pesanan dengan pencarian (kode, nama, nomor HP), detail kustomisasi, ubah status, isi resi, tombol kirim kabar lewat WhatsApp | P0 |
| F9 | Kelola produk | Admin menambah dan mengubah produk, opsi kustomisasi, dan harga tiap opsi | P0 |
| F10 | Ongkos kirim | Pilihan antar langsung atau kurir darat (JNE, J&T, dll.) khusus Pulau Jawa; tarif diatur admin per wilayah, resi diisi manual | P0 |
| F11 | Tombol WhatsApp | Tombol tanya admin di halaman produk | P1 |
| F12 | Status dan pelacakan pesanan | Halaman status menampilkan linimasa perubahan status, ringkasan ukuran dan kustomisasi, estimasi selesai, serta kurir dan resi; alamat lengkap tidak ditampilkan. Halaman Lacak pesanan hanya menampilkan pesanan bila kode dan nomor HP cocok, dan percobaan dibatasi per IP | P0 |
| F13 | Lupa kode pesanan | Pembeli memasukkan email atau nomor HP; kode dikirim ulang hanya ke email yang tercatat di pesanan, dan jawaban di layar selalu sama baik data ada maupun tidak. Jika gagal, pembeli bisa menghubungi admin lewat WhatsApp dan admin mencari pesanan di panel | P1 |

Karena dikerjakan seorang diri, ongkir memakai tarif tetap per wilayah dan resi diisi manual; integrasi API kurir ditunda ke versi 2. Pelacakan pesanan memakai kode pesanan dan nomor HP tanpa akun; verifikasi OTP ditunda ke versi 2.

## Kebutuhan non-fungsional

Tiga hal yang paling menentukan untuk pengguna HP adalah kecepatan, kemudahan sentuh, dan keamanan pembayaran.

| Aspek | Target |
| --- | --- |
| Tampilan | Mobile-first, responsif dari lebar 360 px; tombol dan input mudah disentuh (minimal 44 px) |
| Kecepatan | Halaman utama termuat di bawah 3 detik pada jaringan 4G; gambar dikompres dan dimuat bertahap |
| Keamanan | HTTPS wajib; kata sandi admin di-hash; data pembayaran ditangani oleh payment gateway, tidak disimpan di server sendiri; pencarian pesanan dibatasi percobaannya per IP dan alamat lengkap tidak ditampilkan |
| Kompatibilitas | Chrome dan Safari di Android dan iOS versi dua tahun terakhir |
| SEO dasar | Judul dan deskripsi unik per produk, URL yang rapi |
| Ketersediaan | Hosting dengan uptime minimal 99%, cadangan data harian |

## Desain dan tampilan

Tema yang dipilih adalah zaitun dan krem: tenang, cocok untuk busana muslim, dan membuat foto bahan dan warna gamis tampil jujur.

| Peran | Warna | Kode | Dipakai untuk |
| --- | --- | --- | --- |
| Utama | Hijau zaitun tua | #2F4A3A | Tombol utama, header, tautan |
| Aksen | Emas kusam | #B8893B | Label "Custom", garis pemisah (hemat) |
| Latar | Krem | #F7F2E8 | Latar halaman |
| Permukaan | Krem tua | #E6DCC6 | Kartu, placeholder foto, kolom input |

**Aturan tampilan:**

- Font: judul produk serif (Lora atau Playfair Display), isi dan tombol Plus Jakarta Sans atau Inter.
- Katalog 2 kolom dengan foto rasio 4:5, menampilkan nama, harga "Mulai Rp ...", dan estimasi pengerjaan.
- Tombol utama menempel di bawah layar pada halaman detail dan checkout, tinggi minimal 44 px.
- Form kustomisasi bertahap (ukuran, bahan, warna, catatan) dengan indikator langkah; warna dipilih lewat swatch bulat dan harga berubah langsung.
- Panduan ukuran berupa gambar sederhana, dibuka lewat tautan "Cara mengukur".
- Emas hanya sebagai aksen kecil; satu tombol utama hijau per layar.

## Tech stack dan skema database

Rincian teknis dipisah ke dua berkas agar PRD tetap fokus pada produk: `TECH_STACK.md` dan `DATABASE_SCHEMA.md`. Keduanya disimpan di Project AppTarda, dan bila ada perbedaan, berkas itulah yang berlaku.

| Hal | Keputusan |
| --- | --- |
| Framework | Next.js (App Router) + JavaScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, Storage), region Singapura |
| Pembayaran | Midtrans Snap |
| Hosting | Vercel |
| Notifikasi | Email dan tautan `wa.me`. Pengirim email belum diputuskan karena domain `*.vercel.app` tidak bisa dipakai di Resend |

- `TECH_STACK.md`: stack lengkap, keputusan terbuka, batas paket gratis Supabase, struktur proyek, tabel rute ke fitur, alur pembayaran Midtrans, status pesanan, variabel lingkungan, aturan keamanan, dan urutan membuat proyek.
- `DATABASE_SCHEMA.md`: sembilan tabel beserta kolomnya, diagram relasi, trigger, indeks, aturan akses (RLS), bucket foto, data contoh, dan cara memasang `schema.sql` dan `seed.sql`.

Dua aturan yang memengaruhi produk: total harga selalu dihitung ulang di server sebelum pembayaran, dan status pesanan hanya menjadi dibayar lewat webhook Midtrans.

## Jadwal 7 hari

Hari ke-6 dan ke-7 dipakai untuk pengujian dan perbaikan, dan 19 Oktober 2026 menjadi cadangan sekaligus hari rilis.

| Hari | Tanggal | Pekerjaan | Hasil |
| --- | --- | --- | --- |
| 1 | Sen, 12 Okt | Finalisasi PRD, ajukan akun merchant Midtrans, buat proyek Next.js, Supabase, dan Vercel, desain wireframe mobile, siapkan data produk dan foto | Wireframe dan daftar produk siap |
| 2 | Sel, 13 Okt | Setup proyek dan database, template layout mobile, katalog dan detail produk (F1, F2) | Katalog bisa dibuka |
| 3 | Rab, 14 Okt | Form kustomisasi dan perhitungan harga (F3), keranjang (F4) | Pembeli bisa memilih dan menyimpan ke keranjang |
| 4 | Kam, 15 Okt | Checkout tamu dengan email wajib (F5), pilihan pengiriman (F10), halaman konfirmasi dan status pesanan dengan linimasa (F7, F12) | Pesanan tersimpan dan statusnya bisa dilihat lewat kode |
| 5 | Jum, 16 Okt | Integrasi Midtrans dan webhook (F6), panel admin pesanan dengan pencarian dan email perubahan status (F8) | Pesanan bisa dibayar dan diproses admin |
| 6 | Sab, 17 Okt | Kelola produk dan harga (F9), halaman Lacak pesanan (F12), uji alur penuh di HP nyata, perbaiki bug | Daftar bug P0 kosong |
| 7 | Min, 18 Okt | Tombol WhatsApp (F11) dan kirim ulang kode pesanan (F13) jika waktu ada, optimasi gambar, deploy ke domain, uji pembayaran Midtrans mode produksi | Situs live di server |
| Cadangan | Sen, 19 Okt | Perbaikan akhir dan rilis ke pengguna | Tenggat |

## Metrik keberhasilan

MVP dianggap berhasil jika pembeli benar-benar bisa menyelesaikan pesanan; angka di bawah adalah target awal yang perlu Anda sesuaikan.

| Metrik | Target 30 hari pertama | Cara mengukur |
| --- | --- | --- |
| Pesanan selesai dibayar | Minimal 10 pesanan | Data pesanan di panel admin |
| Konversi pengunjung ke pesanan | 1–2% | Google Analytics |
| Pesanan yang ditinggal di checkout | Di bawah 70% | Analytics funnel checkout |
| Waktu muat halaman di HP | Di bawah 3 detik | PageSpeed Insights |
| Pesanan dengan data ukuran lengkap | 100% | Validasi form dan data pesanan |
| Pertanyaan status atau kode pesanan lewat WhatsApp | Di bawah 20% dari total pesanan | Hitungan manual oleh admin |

## Asumsi, risiko, dan pertanyaan terbuka

**Asumsi** (belum Anda konfirmasi, jadi saya tetapkan sendiri):

- Penjual tunggal dengan satu toko, bukan marketplace banyak penjual.
- Katalog awal berisi sekitar 5–10 model gamis, dengan opsi kustomisasi tetap (pilihan ukuran, bahan, dan warna).
- Pengiriman hanya ke Pulau Jawa (antar langsung atau kurir darat seperti JNE dan J&T), mata uang rupiah, bahasa Indonesia.
- Pembeli tidak wajib punya akun; pembayaran lewat Midtrans, harga kustomisasi diatur admin, dan seluruh pembangunan dikerjakan satu orang.
- Email pembeli wajib diisi; pelacakan pesanan memakai kode pesanan dan nomor HP, tanpa akun dan tanpa OTP.

**Risiko:**

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Verifikasi akun Midtrans terlambat (bisa berhari-hari) | Tidak bisa menerima pembayaran online | Ajukan akun di hari 1 dan bangun dulu di Sandbox Midtrans; siapkan transfer manual sebagai cadangan darurat |
| Foto dan data produk belum siap | Katalog kosong saat uji | Kumpulkan sejak hari 1; pakai data contoh sementara |
| Pembeli salah mengisi ukuran | Barang tidak pas, retur | Panduan ukuran bergambar dan konfirmasi ukuran sebelum bayar |
| Lingkup melebar | Tenggat terlewat | Semua permintaan baru masuk daftar versi 2 |
| Dikerjakan seorang diri dalam 7 hari | Fitur P0 tidak semua selesai | Pakai template/framework siap pakai, kerjakan P0 berurutan, dan potong F11, lalu F13, bila mepet |
| Proyek gratis Supabase dijeda saat sepi dan tanpa backup otomatis | Toko tidak bisa dibuka dan data pesanan berisiko | Upgrade ke Pro sebelum menerima pesanan sungguhan, atau backup manual berkala |
| Email tidak sampai ke pembeli (domain pengirim belum diverifikasi di Resend atau masuk spam) | Pembeli tidak menerima kode dan tautan status | Verifikasi domain pengirim (SPF/DKIM) sedini mungkin; kode juga tampil di halaman konfirmasi; admin bisa mengirim ulang tautan lewat WhatsApp |
| Pembeli lupa kode atau salah mengetik email | Pembeli tidak bisa melacak pesanan dan menghubungi admin | Tampilkan email yang disamarkan di halaman konfirmasi; admin mencari pesanan lewat nomor HP lalu mengirim tautan |

**Pertanyaan terbuka:**

- [x] Metode pembayaran: Midtrans (sudah ditentukan).
- [x] Pembangun: Anda sendiri (sudah ditentukan).
- [x] Harga custom: langsung muncul dan diatur admin (sudah ditentukan).
- [x] Pengiriman: hanya Pulau Jawa, antar langsung atau kurir darat (sudah ditentukan).
- [ ] Apakah domain toko sudah dimiliki? Dibutuhkan untuk verifikasi pengirim email di Resend dan untuk deploy.
