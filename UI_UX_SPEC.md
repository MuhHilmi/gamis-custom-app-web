# UI/UX Spec: Toko Gamis Pria Custom

Dokumen ini menjelaskan tampilan dan perilaku antarmuka. Fitur (F1–F13) ada di PRD, rute di [TECH_STACK.md](TECH_STACK.md), alur sistem di [ARCHITECTURE.md](ARCHITECTURE.md), data di [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

Prinsip: **mobile-first** (lebar acuan 360 px), cepat dibaca, dan tidak membuat pembeli menebak. Pembeli gamis custom paling takut salah ukuran, jadi ukuran, harga, dan estimasi selesai harus selalu terlihat.

## 1. Tema: zaitun dan krem

### 1.1 Token warna

Rasio kontras dihitung dengan rumus WCAG 2.x. Batas: teks biasa 4,5:1, teks besar (≥ 18,66 px tebal atau ≥ 24 px) dan elemen antarmuka 3:1.

| Token | Hex | Pakai untuk |
| --- | --- | --- |
| `zaitun` | `#2F4A3A` | Tombol utama, header, tautan, ikon aktif |
| `zaitun-hover` | `#243A2D` | Tombol utama saat disorot/ditekan |
| `krem` | `#F7F2E8` | Latar halaman |
| `krem-tua` | `#E6DCC6` | Latar bagian selang-seling, kartu sekunder |
| `putih` | `#FFFFFF` | Kartu, input |
| `teks` | `#1F2A24` | Teks utama |
| `teks-sekunder` | `#5C6A60` | Keterangan, label kecil (jangan di atas `krem-tua`) |
| `emas` | `#B8893B` | **Dekoratif saja**: garis hias, ikon besar, bintang. Jangan untuk teks |
| `emas-tua` | `#7A5A1E` | Teks beraksen emas |
| `garis-input` | `#6F7A6C` | Border input dan kotak pilihan |
| `garis` | `#CFC4A8` | Pemisah dekoratif (bukan batas input) |
| `merah` / `merah-bg` | `#9B2C2C` / `#F6DEDC` | Galat |
| `ok` / `ok-bg` | `#2F6B45` / `#DDEBDD` | Berhasil |
| `peringatan` / `peringatan-bg` | `#6B4A0E` / `#F5E6C4` | Perhatian |

### 1.2 Pasangan warna yang sudah dicek

| Teks / elemen | Latar | Rasio | Hasil |
| --- | --- | --- | --- |
| `krem` | `zaitun` | 8,71 | Lulus |
| `putih` | `zaitun` | 9,72 | Lulus |
| `krem` | `zaitun-hover` | 10,95 | Lulus |
| `zaitun` | `krem` | 8,71 | Lulus |
| `zaitun` | `krem-tua` | 7,13 | Lulus |
| `teks` | `krem` / `putih` / `krem-tua` | 13,30 / 14,84 / 10,90 | Lulus |
| `teks-sekunder` | `krem` / `putih` | 5,11 / 5,70 | Lulus |
| `teks-sekunder` | `krem-tua` | 4,18 | **Gagal untuk teks kecil**: pakai `teks` di `krem-tua` |
| `emas-tua` | `krem` | 5,69 | Lulus |
| `emas` | `krem` / `putih` | 2,82 / 3,14 | **Gagal untuk teks**; hanya hiasan |
| `garis-input` | `krem` / `putih` | 4,02 / 4,49 | Lulus (≥ 3:1 untuk batas input) |
| `garis` | `krem` | 1,55 | Gagal sebagai batas input; hanya pemisah hias |
| `merah` | `krem` / `merah-bg` | 6,74 / 5,88 | Lulus |
| `ok` / `peringatan` di latar masing-masing | | 5,14 / 6,51 | Lulus |

Catatan: PRD menyebut emas sebagai aksen. Aturannya diperjelas di sini: `#B8893B` tidak boleh dipakai untuk teks atau batas penting, karena tidak memenuhi kontras.

### 1.3 Implementasi Tailwind v4

Token didefinisikan di `src/app/globals.css`, bukan di `tailwind.config.js`:

```css
@import "tailwindcss";

@theme {
  --color-zaitun: #2F4A3A;
  --color-zaitun-hover: #243A2D;
  --color-krem: #F7F2E8;
  --color-krem-tua: #E6DCC6;
  --color-teks: #1F2A24;
  --color-teks-sekunder: #5C6A60;
  --color-emas: #B8893B;
  --color-emas-tua: #7A5A1E;
  --color-garis-input: #6F7A6C;
  --color-garis: #CFC4A8;
  --color-merah: #9B2C2C;
  --color-merah-bg: #F6DEDC;
  --color-ok: #2F6B45;
  --color-ok-bg: #DDEBDD;
  --color-peringatan: #6B4A0E;
  --color-peringatan-bg: #F5E6C4;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-serif: var(--font-lora), Georgia, serif;
}
```

Hanya tema terang. Mode gelap tidak dibuat di MVP.

## 2. Tipografi dan jarak

- Judul: Lora (serif) untuk kesan busana; isi dan antarmuka: Inter. Muat lewat `next/font` agar tidak ada lonjakan tata letak. Jika waktu mepet, pakai satu keluarga saja (Inter).
- Ukuran dasar teks isi **16 px** (di bawah itu iOS memperbesar layar saat input difokus). Judul halaman 24–28 px, judul seksi 20 px, keterangan 14 px.
- Tinggi baris 1,5 untuk isi. Panjang baris maksimal sekitar 65 karakter.
- Jarak memakai kelipatan 4 px. Gutter halaman 16 px di ponsel, 24 px di tablet ke atas.
- Harga: angka tebal, format rupiah `Rp 350.000` (titik pemisah ribuan, spasi setelah Rp). Gunakan `font-variant-numeric: tabular-nums` agar angka sejajar.

## 3. Tata letak dan breakpoint

| Lebar | Perilaku |
| --- | --- |
| < 640 px (ponsel) | Satu kolom; grid produk 2 kolom; navigasi bawah tidak dipakai, cukup header + ikon keranjang |
| 640–1023 px | Grid produk 3 kolom; form checkout tetap satu kolom |
| ≥ 1024 px | Grid produk 4 kolom; detail produk dua kolom (foto kiri, form kanan); checkout dua kolom (form + ringkasan) |

Lebar konten maksimal 1152 px, dipusatkan. Panel admin dirancang untuk laptop tetapi tetap bisa dipakai di ponsel (tabel menjadi daftar kartu).

## 4. Komponen

**Tombol**
- Utama: latar `zaitun`, teks `krem`, tinggi minimal **48 px**, sudut 8 px, lebar penuh di ponsel.
- Sekunder: latar transparan, border 2 px `zaitun`, teks `zaitun`.
- Bahaya (batalkan pesanan di admin): latar `merah`, teks putih.
- Status: hover `zaitun-hover`; fokus cincin 3 px `zaitun` dengan offset 2 px (kontras 8,71 di `krem`); nonaktif memakai opasitas 50% **plus** kursor `not-allowed` dan teks penjelasan di dekatnya bila alasannya tidak jelas.
- Saat memproses: teks berubah ("Memproses…"), tombol dinonaktifkan agar tidak terkirim dua kali.

**Input**
- Latar putih, border 1,5 px `garis-input`, tinggi 48 px, teks 16 px. Label selalu terlihat di atas input (bukan hanya placeholder).
- Atribut yang tepat: `type="tel"` + `inputmode="numeric"` untuk nomor HP, `type="email"`, `autocomplete` (`name`, `tel`, `email`, `street-address`, `postal-code`).
- Galat muncul di bawah input, berwarna `merah` dengan ikon, dan terhubung lewat `aria-describedby`. Jangan hanya mengandalkan warna.

**Pemilih ukuran, bahan, warna**
- Ukuran: deretan chip (S–XXXL) minimal 44×44 px; terpilih = latar `zaitun` teks `krem`. Ukuran besar menampilkan tambahan harga ("XXL +Rp 15.000").
- Bahan: kartu radio dengan nama, tambahan harga, dan catatan singkat.
- Warna: lingkaran contoh warna **disertai nama warna** (teks), karena warna saja tidak cukup.
- Tautan "Panduan ukuran" membuka lembar bawah (bottom sheet) berisi `size_chart` produk.

**Kartu produk**: foto rasio 4:5, nama (maks 2 baris), "Mulai Rp …", lencana estimasi ("± 7–14 hari") bila ruang cukup. Seluruh kartu adalah satu tautan.

**Lencana status** (teks selalu ada, tidak hanya warna)

| Status | Label pembeli | Warna |
| --- | --- | --- |
| `menunggu_pembayaran` | Menunggu pembayaran | Peringatan |
| `dibayar` | Dibayar | Hijau |
| `diproses` | Diproses | Hijau muda (`zaitun` di `#DCE5DA`, 7,52:1) |
| `dikerjakan` | Sedang dijahit | Hijau muda |
| `dikirim` | Dikirim | Hijau muda |
| `selesai` | Selesai | Hijau |
| `kedaluwarsa` / `dibatalkan` | Kedaluwarsa / Dibatalkan | Merah |

**Linimasa pesanan**: vertikal di ponsel; langkah selesai = ikon centang `zaitun`, langkah saat ini = lingkaran tebal + label "Sekarang", langkah berikutnya = abu. Tiap langkah menampilkan tanggal bila ada (dari `order_events`).

**Toast dan banner**: pesan sukses/galat singkat memakai `role="status"` (atau `role="alert"` untuk galat). Banner persisten untuk hal penting (misalnya "Pesanan ini belum dibayar").

**Lembar bawah (bottom sheet)**: untuk panduan ukuran dan ringkasan keranjang di ponsel; dapat ditutup dengan tombol, geser ke bawah, dan tombol Esc.

## 5. Layar

### 5.1 Landing dan katalog `/` (F1)

Urutan di ponsel:
1. Header: logo/nama toko di kiri, ikon keranjang dengan jumlah di kanan, tautan "Lacak pesanan".
2. Hero: satu kalimat nilai ("Gamis pria dijahit sesuai ukuranmu"), subjudul estimasi pengerjaan, satu tombol "Lihat koleksi". Latar `zaitun` dengan teks `krem`.
3. Tiga keunggulan singkat: ukuran custom, harga langsung terlihat, pengiriman se-Jawa.
4. Chip filter kategori (geser horizontal), lalu grid produk.
5. Bagian "Cara pesan" (3 langkah: pilih, ukur, bayar).
6. Footer: kontak WhatsApp (`wa.me`), kebijakan pengiriman dan pengembalian, tautan lacak.

Keadaan: memuat (kerangka kartu abu), kosong ("Belum ada produk di kategori ini" + tombol lihat semua), galat (pesan + coba lagi).

### 5.2 Detail produk `/produk/[slug]` (F2, F3)

- Galeri foto: geser horizontal dengan penunjuk titik; ketuk untuk memperbesar.
- Nama, harga dasar, estimasi pengerjaan (`lead_time_days`) tepat di bawah nama.
- Form kustomisasi berurutan: **Ukuran → Bahan → Warna → Jumlah**. Tiap seksi diberi nomor.
- **Harga langsung dihitung ulang** saat pilihan berubah, memakai `lib/pricing.js`. Rincian terlihat: harga dasar + tambahan ukuran + tambahan bahan. Angka ini hanya tampilan; server menghitung ulang saat checkout.
- Bilah bawah menempel (sticky): total harga dan tombol "Tambah ke keranjang". Tombol nonaktif sampai ukuran, bahan, dan warna dipilih; teks di dekatnya menyebut apa yang belum dipilih ("Pilih ukuran dulu").
- Ada catatan: "Produk custom dijahit setelah dibayar, sehingga tidak bisa dibatalkan setelah proses dimulai" (kebijakan final mengikuti keputusan pemilik toko).
- Setelah ditambahkan: toast "Masuk keranjang" dengan tautan "Lihat keranjang"; pembeli tidak dilempar ke halaman lain.

### 5.3 Keranjang `/keranjang` (F4)

- Daftar item: foto kecil, nama, ringkasan pilihan (ukuran · bahan · warna), harga satuan, pengatur jumlah (− / +, 44 px), hapus.
- Ubah pilihan = hapus lalu tambah ulang di MVP (ada tautan "Ubah" ke halaman produk dengan pilihan terisi bila waktu cukup).
- Ringkasan: subtotal; ongkir dihitung di checkout. Tombol "Lanjut ke checkout".
- Keadaan kosong: ilustrasi sederhana, "Keranjangmu masih kosong", tombol ke koleksi.
- Keranjang tersimpan di browser (localStorage, dibungkus try/catch). Harga di keranjang ditandai "perkiraan" dan dikonfirmasi ulang oleh server.

### 5.4 Checkout `/checkout` (F5, F10)

Satu halaman, satu kolom di ponsel, dengan bagian berurutan:
1. **Data penerima**: nama, nomor HP, **email (wajib**, dipakai mengirim kode pesanan dan kabar status).
2. **Alamat**: alamat lengkap, kota/kabupaten, provinsi (dropdown se-Jawa saja), kode pos.
3. **Pengiriman**: pilihan "Antar langsung" (hanya jika alamat masuk area) atau "Kurir darat" (JNE/J&T dan sejenisnya). Ongkir otomatis dari zona; bila provinsi di luar Jawa, tampilkan pesan jelas bahwa pengiriman belum tersedia.
4. **Ringkasan pesanan**: item, subtotal, ongkir, **total**. Di ponsel berupa panel yang bisa dibuka di atas tombol bayar.
5. Tombol "Bayar sekarang" membuka jendela Snap Midtrans.

Aturan:
- Validasi per kolom saat keluar dari kolom dan sekali lagi saat kirim; galat pertama menerima fokus dan digulir ke tampilan.
- Setelah tombol ditekan, tombol dikunci sampai Snap menjawab. Bila Snap ditutup tanpa bayar, tampilkan "Pembayaran belum selesai" dengan tombol "Coba bayar lagi" (pesanan yang sama; satu upaya pembayaran per pesanan sesuai arsitektur) dan tautan ke halaman pesanan.
- Data form tidak hilang bila pembeli kembali ke keranjang.

### 5.5 Status pesanan `/pesanan/[kode]` (F7, F12)

- Atas: lencana status besar, kode pesanan (dengan tombol "Salin"), estimasi selesai ("Perkiraan siap: 24 Okt 2026").
- Pesan penyimpanan kode: "Simpan kode ini. Kami juga mengirimnya ke email kamu."
- Linimasa, rincian item (ukuran, bahan, warna), alamat, ringkasan biaya.
- Nomor resi dan nama kurir muncul saat `dikirim`, dengan tombol salin.
- Tombol "Tanya lewat WhatsApp" membuka `wa.me` dengan pesan awal berisi kode pesanan.
- Halaman diakses lewat kode acak (`GM-` + 10 karakter) dan tidak ditampilkan penuh kepada orang yang hanya menebak; lihat batasan di ARCHITECTURE.md.

### 5.6 Lacak dan lupa kode `/lacak` (F12, F13)

- Form: kode pesanan + nomor HP → tombol "Lacak".
- Galat umum dan seragam: "Kode atau nomor HP tidak cocok" (tidak membocorkan mana yang salah).
- Setelah batas percobaan: "Terlalu banyak percobaan, coba lagi beberapa menit lagi."
- Tautan "Lupa kode pesanan?" membuka form email. Respons **selalu sama** ("Jika ada pesanan dengan email itu, kode dikirim ke sana"), agar tidak bisa dipakai menebak email pelanggan.

### 5.7 Admin (F8–F10)

Login `/admin/login` dengan email dan kata sandi.

- **Pesanan** `/admin/pesanan`: pencarian (kode, nama, HP), filter status, daftar. Di laptop berupa tabel; di ponsel berupa kartu. Rincian pesanan: item dengan ukuran/bahan/warna, alamat, tombol salin alamat, pengubah status (hanya transisi yang valid, status `dibayar` tidak bisa diatur manual), isian resi dan kurir, tombol "Hubungi via WhatsApp".
- **Produk** `/admin/produk`: daftar, tambah/ubah, unggah foto (maks 2 MB, JPEG/PNG/WebP, dikompres di browser), kelola opsi ukuran/bahan/warna beserta tambahan harga, aktif/nonaktif.
- **Ongkir** `/admin/ongkir`: tabel zona dan tarif yang bisa diubah langsung.
- Aksi merusak (hapus, batalkan) memakai dialog konfirmasi yang menyebut objeknya ("Batalkan pesanan GM-XXXX?").
- Setelah simpan: toast dan data diperbarui tanpa muat ulang penuh.

## 6. Salinan teks (microcopy)

Bahasa Indonesia, nada ramah tapi tidak berlebihan, kalimat pendek, "kamu" (bukan "Anda") agar akrab; ganti ke "Anda" jika pemilik toko lebih suka formal.

| Situasi | Teks |
| --- | --- |
| Tombol tambah | Tambah ke keranjang |
| Belum pilih ukuran | Pilih ukuran dulu |
| Keranjang kosong | Keranjangmu masih kosong |
| Galat nomor HP | Nomor HP tidak valid. Contoh: 081234567890 |
| Galat email | Email tidak valid. Contoh: nama@email.com |
| Di luar Jawa | Maaf, saat ini kami hanya mengirim ke Pulau Jawa |
| Bayar gagal | Pembayaran belum selesai. Pesananmu tersimpan, kamu bisa mencoba bayar lagi |
| Pesanan kedaluwarsa | Pesanan kedaluwarsa karena belum dibayar. Silakan buat pesanan baru |
| Galat server | Terjadi masalah di sisi kami. Coba lagi sebentar lagi |
| Kode tersalin | Kode tersalin |

Pesan galat menjelaskan **apa yang terjadi dan apa yang bisa dilakukan**, tanpa istilah teknis.

## 7. Aksesibilitas

- Kontras mengikuti tabel di bagian 1.2.
- Target sentuh minimal 44×44 px, jarak antar target minimal 8 px.
- Semua fungsi dapat dipakai dengan papan ketik; urutan fokus mengikuti urutan visual; cincin fokus selalu terlihat.
- Satu `<h1>` per halaman; landmark `header`, `nav`, `main`, `footer`.
- Gambar produk memakai `alt` bermakna (nama produk + warna); gambar hias memakai `alt=""`.
- Informasi tidak boleh hanya lewat warna (status berlabel teks, warna diberi nama, galat diberi ikon dan teks).
- Hormati `prefers-reduced-motion`: matikan animasi geser/transisi besar.
- Dialog dan lembar bawah menjebak fokus, mengembalikan fokus saat ditutup, dan menutup dengan Esc.
- Jangan menonaktifkan zoom (`user-scalable=no` dilarang).

## 8. Performa yang terlihat pengguna

- Target: LCP ≤ 2,5 dtk di jaringan 4G menengah; tidak ada lonjakan tata letak (CLS ≤ 0,1).
- `next/image` dengan `sizes` yang benar; foto hero dan produk pertama diberi `priority`; sisanya dimuat malas.
- Foto produk diunggah admin dalam ukuran maksimal 2 MB dan dikompres di browser sebelum unggah.
- Kerangka (skeleton) untuk daftar produk dan pesanan, bukan layar kosong.
- Skrip Midtrans Snap dimuat hanya di `/checkout`.

## 9. Konten dan aset yang dibutuhkan dari pemilik toko

Sebelum hari 2 (katalog) perlu tersedia:
- Nama toko dan logo (atau diputuskan memakai teks saja).
- Foto produk asli minimal 3 sudut per produk (depan, belakang, detail kain).
- Panduan ukuran (tabel lingkar dada, panjang, bahu) per model.
- Deskripsi bahan dan perawatan.
- Kebijakan: pembatalan, pengembalian, perubahan alamat.
- Nomor WhatsApp admin.

## 10. Layar yang perlu dimockup lebih dulu

Urutan prioritas jika ingin memvalidasi tampilan sebelum menulis kode: (1) detail produk dengan form kustomisasi, (2) checkout, (3) status pesanan, (4) landing. Bagian lain mengikuti komponen yang sama.

## 11. Pertanyaan terbuka

| Pertanyaan | Dampak |
| --- | --- |
| Nama toko dan logo | Header, hero, email, judul halaman |
| Sapaan "kamu" atau "Anda" | Seluruh teks antarmuka |
| Kebijakan pembatalan dan pengembalian barang custom | Catatan di detail produk, checkout, dan footer |
| Satu atau dua font | Ukuran muat halaman |
| Perlu fitur "ubah pilihan" di keranjang pada MVP | Waktu pengerjaan hari 3 |
