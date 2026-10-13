-- Migrasi satu kali: ganti foto produk dari path picsum/old seed ke foto
-- lokal yang sudah ada di public/product-photos. Jalankan di Supabase SQL Editor
-- setelah foto disimpan. Tidak mengubah harga, nama, atau data pesanan.
update products set photos = array['/product-photos/Gamis1.jpg'] where slug = 'gamis-katun-harian';
update products set photos = array['/product-photos/Gamis2.jpg'] where slug = 'gamis-linen-santai';
update products set photos = array['/product-photos/Gamis3.jpg'] where slug = 'gamis-polos-classic';
update products set photos = array['/product-photos/Gamis4.jpg'] where slug = 'gamis-toyobo-acara';
update products set photos = array['/product-photos/Gamis5.jpg'] where slug = 'gamis-bordir-kerah';
update products set photos = array['/product-photos/Gamis6.jpg'] where slug = 'gamis-pernikahan-premium';
update products set photos = array['/product-photos/Gamis7.jpg'] where slug = 'gamis-seragam-kantor';
update products set photos = array['/product-photos/Gamis8.jpg'] where slug = 'gamis-seragam-pengajian';
