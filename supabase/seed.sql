-- =====================================================================
-- seed.sql: DATA CONTOH untuk toko gamis pria custom
-- Jalankan SETELAH schema.sql. Aman dijalankan ulang (on conflict do nothing),
-- jadi harga yang sudah diubah lewat panel admin tidak tertimpa.
--
-- Semua isi di sini dummy. Ganti sebelum rilis lewat panel admin: nama dan
-- harga produk, deskripsi, tambahan harga bahan dan ukuran, tabel ukuran,
-- tarif ongkir, dan nama zona antar langsung.
-- Foto memakai berkas lokal di public/product-photos (path web /product-photos/...)
-- atau kunci objek di bucket Supabase Storage "product-photos". Taruh foto asli
-- dengan nama berkas yang cocok dengan nilai di kolom photos.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Kategori (3)
-- ---------------------------------------------------------------------
insert into categories (name, slug, sort_order) values
  ('Gamis Harian',  'gamis-harian',  1),
  ('Gamis Acara',   'gamis-acara',   2),
  ('Gamis Seragam', 'gamis-seragam', 3)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Produk (8). Tabel ukuran universal dipakai semua produk.
-- ---------------------------------------------------------------------
with chart as (
  select '[
    {"ukuran":"S",   "lingkar_dada_cm":100, "panjang_cm":130},
    {"ukuran":"M",   "lingkar_dada_cm":104, "panjang_cm":135},
    {"ukuran":"L",   "lingkar_dada_cm":108, "panjang_cm":138},
    {"ukuran":"XL",  "lingkar_dada_cm":112, "panjang_cm":141},
    {"ukuran":"XXL", "lingkar_dada_cm":118, "panjang_cm":144},
    {"ukuran":"XXXL","lingkar_dada_cm":124, "panjang_cm":147}
  ]'::jsonb as c
)
insert into products
  (category_id, slug, name, description, material_info, base_price, photos, size_chart, lead_time_days)
select
  cat.id,
  v.slug,
  v.name,
  v.description,
  v.material_info,
  v.base_price,
  array[
    case v.slug
      when 'gamis-katun-harian' then '/product-photos/Gamis1.jpg'
      when 'gamis-linen-santai' then '/product-photos/Gamis2.jpg'
      when 'gamis-polos-classic' then '/product-photos/Gamis3.jpg'
      when 'gamis-toyobo-acara' then '/product-photos/Gamis4.jpg'
      when 'gamis-bordir-kerah' then '/product-photos/Gamis5.jpg'
      when 'gamis-pernikahan-premium' then '/product-photos/Gamis6.jpg'
      when 'gamis-seragam-kantor' then '/product-photos/Gamis7.jpg'
      when 'gamis-seragam-pengajian' then '/product-photos/Gamis8.jpg'
      else '/product-photos/Gamis.jpg'
    end
  ],
  chart.c,
  v.lead_time_days
from chart
cross join (values
  ('gamis-harian',  'gamis-katun-harian',   'Gamis Katun Harian',
   'Gamis polos nyaman untuk dipakai sehari-hari. (Deskripsi dummy)',
   'Katun adem, menyerap keringat. Cuci dengan air dingin. (Dummy)', 275000, 7),
  ('gamis-harian',  'gamis-linen-santai',   'Gamis Linen Santai',
   'Potongan longgar berbahan linen, cocok untuk cuaca panas. (Deskripsi dummy)',
   'Linen ringan, mudah kusut khas linen. (Dummy)', 325000, 7),
  ('gamis-harian',  'gamis-polos-classic',  'Gamis Polos Classic',
   'Model klasik dengan kerah tegak dan kancing depan. (Deskripsi dummy)',
   'Campuran katun dan poliester, tidak mudah kusut. (Dummy)', 295000, 7),
  ('gamis-acara',   'gamis-toyobo-acara',   'Gamis Toyobo Acara',
   'Jatuh dan rapi untuk salat Id, pengajian, dan acara keluarga. (Deskripsi dummy)',
   'Toyobo premium, jatuh dan tidak menerawang. (Dummy)', 450000, 10),
  ('gamis-acara',   'gamis-bordir-kerah',   'Gamis Bordir Kerah',
   'Bordir halus di kerah dan manset. (Deskripsi dummy)',
   'Kain tebal dengan bordir mesin. (Dummy)', 550000, 12),
  ('gamis-acara',   'gamis-pernikahan-premium', 'Gamis Pernikahan Premium',
   'Tampil rapi dan elegan untuk akad dan resepsi. (Deskripsi dummy)',
   'Bahan premium berlapis, pengerjaan lebih teliti. (Dummy)', 650000, 14),
  ('gamis-seragam', 'gamis-seragam-kantor', 'Gamis Seragam Kantor',
   'Seragam untuk tim, bisa dipesan banyak. (Deskripsi dummy)',
   'Katun twill, awet untuk pemakaian rutin. (Dummy)', 350000, 10),
  ('gamis-seragam', 'gamis-seragam-pengajian', 'Gamis Seragam Pengajian',
   'Seragam sederhana untuk majelis dan komunitas. (Deskripsi dummy)',
   'Katun Jepang, nyaman dipakai lama. (Dummy)', 320000, 7)
) as v(cat_slug, slug, name, description, material_info, base_price, lead_time_days)
join categories cat on cat.slug = v.cat_slug
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- Opsi ukuran (6 x 8 = 48): S-XL tanpa tambahan, XXL +15.000, XXXL +25.000
-- ---------------------------------------------------------------------
insert into product_options (product_id, type, name, price_delta, sort_order)
select p.id, 'ukuran', s.name, s.delta, s.ord
from products p
cross join (values
  ('S', 0, 1), ('M', 0, 2), ('L', 0, 3), ('XL', 0, 4),
  ('XXL', 15000, 5), ('XXXL', 25000, 6)
) as s(name, delta, ord)
on conflict (product_id, type, name) do nothing;

-- ---------------------------------------------------------------------
-- Opsi bahan (18): bahan standar tambahan 0. Dua produk acara punya tiga.
-- ---------------------------------------------------------------------
insert into product_options (product_id, type, name, price_delta, sort_order)
select p.id, 'bahan', m.name, m.delta, m.ord
from (values
  ('gamis-katun-harian',        'Katun Standar',  0,     1),
  ('gamis-katun-harian',        'Katun Combed',   20000, 2),
  ('gamis-linen-santai',        'Linen Standar',  0,     1),
  ('gamis-linen-santai',        'Linen Premium',  30000, 2),
  ('gamis-polos-classic',       'Katun Poliester',0,     1),
  ('gamis-polos-classic',       'Katun Combed',   20000, 2),
  ('gamis-toyobo-acara',        'Toyobo Standar', 0,     1),
  ('gamis-toyobo-acara',        'Toyobo Premium', 35000, 2),
  ('gamis-toyobo-acara',        'Toyobo Super',   60000, 3),
  ('gamis-bordir-kerah',        'Kain Tebal',     0,     1),
  ('gamis-bordir-kerah',        'Toyobo',         40000, 2),
  ('gamis-pernikahan-premium',  'Premium Standar',0,     1),
  ('gamis-pernikahan-premium',  'Premium Silk',   75000, 2),
  ('gamis-pernikahan-premium',  'Premium Wool',   90000, 3),
  ('gamis-seragam-kantor',      'Katun Twill',    0,     1),
  ('gamis-seragam-kantor',      'Twill Premium',  25000, 2),
  ('gamis-seragam-pengajian',   'Katun Jepang',   0,     1),
  ('gamis-seragam-pengajian',   'Katun Combed',   20000, 2)
) as m(slug, name, delta, ord)
join products p on p.slug = m.slug
on conflict (product_id, type, name) do nothing;

-- ---------------------------------------------------------------------
-- Opsi warna (6 x 8 = 48): tanpa tambahan harga
-- ---------------------------------------------------------------------
insert into product_options (product_id, type, name, price_delta, swatch_hex, sort_order)
select p.id, 'warna', c.name, 0, c.hex, c.ord
from products p
cross join (values
  ('Hitam',         '#1F1F1F', 1),
  ('Putih',         '#F5F5F0', 2),
  ('Krem',          '#E8DCC0', 3),
  ('Hijau Zaitun',  '#556B2F', 4),
  ('Biru Navy',     '#1F2F4F', 5),
  ('Abu-abu',       '#8A8D8F', 6)
) as c(name, hex, ord)
on conflict (product_id, type, name) do nothing;

-- ---------------------------------------------------------------------
-- Zona ongkir (7): 1 antar langsung + 6 kurir darat di Pulau Jawa
-- ---------------------------------------------------------------------
insert into shipping_zones (name, method, fee, sort_order) values
  ('Antar langsung (area toko, dummy)', 'antar_langsung', 15000, 1),
  ('Jabodetabek',                       'kurir_darat',    20000, 2),
  ('Jawa Barat (di luar Jabodetabek)',  'kurir_darat',    25000, 3),
  ('Banten (di luar Jabodetabek)',      'kurir_darat',    25000, 4),
  ('Jawa Tengah',                       'kurir_darat',    30000, 5),
  ('DI Yogyakarta',                     'kurir_darat',    30000, 6),
  ('Jawa Timur',                        'kurir_darat',    35000, 7)
on conflict (name, method) do nothing;

-- ---------------------------------------------------------------------
-- Ringkasan: harus 3, 8, 48, 18, 48, 7
-- ---------------------------------------------------------------------
select
  (select count(*) from categories)                              as kategori,
  (select count(*) from products)                                as produk,
  (select count(*) from product_options where type = 'ukuran')   as opsi_ukuran,
  (select count(*) from product_options where type = 'bahan')    as opsi_bahan,
  (select count(*) from product_options where type = 'warna')    as opsi_warna,
  (select count(*) from shipping_zones)                          as zona_ongkir;
