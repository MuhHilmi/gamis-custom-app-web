# Gamis Custom

Toko web gamis pria custom: pembeli memilih ukuran, bahan, dan warna, lalu membayar lewat Midtrans. Admin mengelola pesanan, produk, dan ongkir.

Next.js (App Router, JavaScript) + Tailwind v4 + Supabase + Midtrans Snap. Dokumen desain lengkap ada di proyek "AppTarda": PRD, `TECH_STACK.md`, `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `UI_UX_SPEC.md`.

## Mulai

1. Ikuti [SETUP.md](SETUP.md) (Supabase, Gmail, Midtrans, `.env.local`).
2. `npm install`
3. `npm run dev`, lalu buka http://localhost:3000 dan http://localhost:3000/api/health (harus `{"ok":true}`).

## Catatan penting

- Proyek ini memakai Next.js 16: `proxy.js` menggantikan `middleware`, dan Cache Components aktif. Baca `AGENTS.md` sebelum menulis kode.
- Data toko masih dummy (nama, foto Picsum, kebijakan, nomor WhatsApp). Lihat [GO_LIVE_CHECKLIST.md](GO_LIVE_CHECKLIST.md) sebelum menerima pembayaran sungguhan.
- Perubahan skema database dijalankan manual di Supabase SQL Editor. Simpan sebagai berkas bernomor di `supabase/`.
