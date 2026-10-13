-- =====================================================================
-- schema.sql: toko gamis pria custom (Supabase / PostgreSQL)
-- Penjelasan lengkap: DATABASE_SCHEMA.md. Sumber kebenaran tetap berkas ini.
--
-- Cara pakai: Supabase Dashboard > SQL Editor > tempel seluruh berkas > Run.
-- Aman dijalankan ulang untuk enum, fungsi, trigger, kebijakan, dan bucket.
-- Tabel memakai "create table if not exists": perubahan kolom di masa depan
-- harus berupa migrasi terpisah (alter table), simpan sebagai berkas bernomor.
-- Semua harga: bilangan bulat rupiah.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tipe enum
-- ---------------------------------------------------------------------
do $$ begin
  create type option_type as enum ('ukuran', 'bahan', 'warna');
exception when duplicate_object then null; end $$;

do $$ begin
  create type shipping_method as enum ('antar_langsung', 'kurir_darat');
exception when duplicate_object then null; end $$;

do $$ begin
  create type order_status as enum (
    'menunggu_pembayaran', 'dibayar', 'diproses', 'dikerjakan',
    'dikirim', 'selesai', 'kedaluwarsa', 'dibatalkan'
  );
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- 2. Fungsi pembantu
-- ---------------------------------------------------------------------

-- Kode pesanan publik: "GM-" + 10 karakter acak dari 32 huruf/angka yang
-- tidak membingungkan (tanpa I, O, 0, 1). Tanpa ekstensi: byte acak diambil
-- dari gen_random_uuid() dan byte bernilai tetap (versi/varian UUID di byte
-- 6 dan 8) dilewati.
create or replace function gen_order_code() returns text
language plpgsql volatile
set search_path = public
as $$
declare
  chars  constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  b      bytea := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
  result text := 'GM-';
  idx    int;
  i      int;
begin
  for i in 0..9 loop
    idx := case when i < 6 then i else i + 3 end;  -- byte 0-5 dan 9-12
    result := result || substr(chars, (get_byte(b, idx) % 32) + 1, 1);
  end loop;
  return result;
end;
$$;

create or replace function set_updated_at() returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 3. Tabel katalog
-- ---------------------------------------------------------------------
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists products (
  id              uuid primary key default gen_random_uuid(),
  category_id     uuid references categories(id) on delete set null,
  slug            text not null unique,
  name            text not null,
  description     text,
  material_info   text,
  base_price      integer not null check (base_price >= 0),
  photos          text[] not null default '{}',
  size_chart      jsonb not null default '[]'::jsonb,
  lead_time_days  integer not null default 7 check (lead_time_days > 0),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists product_options (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  type        option_type not null,
  name        text not null,
  price_delta integer not null default 0 check (price_delta >= 0),
  swatch_hex  text check (swatch_hex is null or swatch_hex ~ '^#[0-9A-Fa-f]{6}$'),
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (product_id, type, name)
);

create table if not exists shipping_zones (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  method      shipping_method not null,
  fee         integer not null check (fee >= 0),
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (name, method)
);

-- ---------------------------------------------------------------------
-- 4. Tabel pesanan
-- Relasi ke katalog memakai "on delete set null" dan data disalin saat
-- dipesan, supaya menghapus katalog tidak ikut menghapus pesanan lama.
-- ---------------------------------------------------------------------
create table if not exists orders (
  id                  uuid primary key default gen_random_uuid(),
  code                text not null unique default gen_order_code(),
  status              order_status not null default 'menunggu_pembayaran',

  customer_name       text not null check (char_length(btrim(customer_name)) > 0),
  customer_phone      text not null check (char_length(customer_phone) between 8 and 20),
  -- Hanya angka, awalan 0 diganti 62: "0812..." dan "+62 812..." menjadi "62812...".
  customer_phone_norm text generated always as (
    case
      when regexp_replace(customer_phone, '\D', '', 'g') like '0%'
        then '62' || substr(regexp_replace(customer_phone, '\D', '', 'g'), 2)
      else regexp_replace(customer_phone, '\D', '', 'g')
    end
  ) stored,
  customer_email      text not null,

  address             text not null check (char_length(btrim(address)) > 0),
  city                text not null check (char_length(btrim(city)) > 0),
  province            text not null check (char_length(btrim(province)) > 0),
  postal_code         text,
  note                text,

  shipping_zone_id    uuid references shipping_zones(id) on delete set null,
  shipping_zone       text not null,      -- salinan nama zona saat dipesan
  shipping_method     shipping_method not null,
  courier             text,               -- diisi admin, mis. JNE, J&T
  tracking_number     text,               -- resi, diisi admin manual

  subtotal            integer not null check (subtotal >= 0),
  shipping_fee        integer not null check (shipping_fee >= 0),
  total               integer not null check (total >= 0),

  midtrans_order_id   text unique,
  snap_token          text,
  payment_type        text,

  paid_at             timestamptz,
  estimated_ready_at  timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint orders_email_format
    check (customer_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  constraint orders_total_matches
    check (total = subtotal + shipping_fee)
);

create table if not exists order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references orders(id) on delete cascade,
  product_id     uuid references products(id) on delete set null,
  product_name   text not null,
  base_price     integer not null check (base_price >= 0),
  -- Wajib semua: database menolak pesanan tanpa data ukuran.
  size           text not null check (char_length(btrim(size)) > 0),
  material       text not null check (char_length(btrim(material)) > 0),
  color          text not null check (char_length(btrim(color)) > 0),
  options        jsonb not null default '[]'::jsonb,
  custom_note    text,
  lead_time_days integer not null default 7 check (lead_time_days > 0),
  quantity       integer not null check (quantity > 0),
  unit_price     integer not null check (unit_price >= 0),
  line_total     integer not null check (line_total >= 0),
  created_at     timestamptz not null default now(),
  constraint order_items_line_matches
    check (line_total = unit_price * quantity)
);

-- Riwayat perubahan status; terisi otomatis oleh trigger.
create table if not exists order_events (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  status      order_status not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5. Tabel pendukung
-- ---------------------------------------------------------------------
create table if not exists admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- Catatan percobaan /lacak dan /lupa-kode untuk pembatasan per IP.
-- Hanya hash IP yang disimpan. Bersihkan berkala:
--   delete from lookup_attempts where created_at < now() - interval '1 day';
create table if not exists lookup_attempts (
  id          bigint generated always as identity primary key,
  ip_hash     text not null,
  kind        text not null check (kind in ('lacak', 'lupa_kode')),
  created_at  timestamptz not null default now()
);

-- Memeriksa apakah pengguna yang sedang login terdaftar sebagai admin.
-- security definer: tabel admins sendiri tertutup untuk anon dan authenticated.
create or replace function is_admin() returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- 6. Trigger
-- ---------------------------------------------------------------------
drop trigger if exists trg_products_updated on products;
create trigger trg_products_updated
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated on orders;
create trigger trg_orders_updated
  before update on orders
  for each row execute function set_updated_at();

-- Mencatat status awal dan setiap perubahan status ke order_events.
create or replace function log_order_status() returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into order_events (order_id, status) values (new.id, new.status);
  elsif new.status is distinct from old.status then
    insert into order_events (order_id, status) values (new.id, new.status);
  end if;
  return null;
end;
$$;

drop trigger if exists trg_orders_status_log on orders;
create trigger trg_orders_status_log
  after insert or update of status on orders
  for each row execute function log_order_status();

-- Saat status menjadi 'dibayar': isi paid_at (bila kosong) dan estimasi
-- selesai = waktu bayar + lead_time_days terbesar di order_items (default
-- 7 hari bila tidak ada item). Item pesanan harus sudah tersimpan SEBELUM
-- status diubah menjadi 'dibayar'.
create or replace function set_estimated_ready() returns trigger
language plpgsql security definer
set search_path = public
as $$
declare
  lead integer;
begin
  select max(lead_time_days) into lead from order_items where order_id = new.id;
  new.paid_at := coalesce(new.paid_at, now());
  new.estimated_ready_at := new.paid_at + make_interval(days => coalesce(lead, 7));
  return new;
end;
$$;

drop trigger if exists trg_orders_estimate_ready on orders;
create trigger trg_orders_estimate_ready
  before update of status on orders
  for each row
  when (new.status = 'dibayar' and old.status is distinct from new.status)
  execute function set_estimated_ready();

-- ---------------------------------------------------------------------
-- 7. Indeks
-- ---------------------------------------------------------------------
create index if not exists idx_products_category      on products (category_id);
create index if not exists idx_products_active        on products (is_active);
create index if not exists idx_product_options_prod   on product_options (product_id, type, sort_order);
create index if not exists idx_orders_status_created  on orders (status, created_at desc);
create index if not exists idx_order_items_order      on order_items (order_id);
create index if not exists idx_order_events_order     on order_events (order_id, created_at);
create index if not exists idx_orders_phone_norm      on orders (customer_phone_norm);
create index if not exists idx_orders_email_lower     on orders (lower(customer_email));
create index if not exists idx_orders_name_lower      on orders (lower(customer_name));
create index if not exists idx_lookup_attempts_recent on lookup_attempts (ip_hash, kind, created_at desc);

-- ---------------------------------------------------------------------
-- 8. Row Level Security
-- Semua tabel mengaktifkan RLS. Route API memakai service role yang
-- melewati RLS; pembeli tidak pernah menyentuh tabel pesanan dari browser.
-- ---------------------------------------------------------------------
alter table categories      enable row level security;
alter table products        enable row level security;
alter table product_options enable row level security;
alter table shipping_zones  enable row level security;
alter table orders          enable row level security;
alter table order_items     enable row level security;
alter table order_events    enable row level security;
alter table admins          enable row level security;
alter table lookup_attempts enable row level security;

-- Hak tabel (lapisan di bawah RLS).
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables    in schema public to service_role;
grant all on all sequences in schema public to service_role;

revoke all on orders, order_items, order_events, admins, lookup_attempts from anon;
revoke all on admins, lookup_attempts from authenticated;

grant select on categories, products, product_options, shipping_zones to anon, authenticated;
grant insert, update, delete on categories, products, product_options, shipping_zones to authenticated;
grant select, insert, update, delete on orders, order_items, order_events to authenticated;

-- Katalog: pembeli membaca yang aktif; admin membaca dan mengubah semua.
drop policy if exists categories_public_read on categories;
create policy categories_public_read on categories
  for select to anon, authenticated using (is_active);
drop policy if exists categories_admin_all on categories;
create policy categories_admin_all on categories
  for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists products_public_read on products;
create policy products_public_read on products
  for select to anon, authenticated using (is_active);
drop policy if exists products_admin_all on products;
create policy products_admin_all on products
  for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists product_options_public_read on product_options;
create policy product_options_public_read on product_options
  for select to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from products p where p.id = product_options.product_id and p.is_active
    )
  );
drop policy if exists product_options_admin_all on product_options;
create policy product_options_admin_all on product_options
  for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists shipping_zones_public_read on shipping_zones;
create policy shipping_zones_public_read on shipping_zones
  for select to anon, authenticated using (is_active);
drop policy if exists shipping_zones_admin_all on shipping_zones;
create policy shipping_zones_admin_all on shipping_zones
  for all to authenticated using (is_admin()) with check (is_admin());

-- Pesanan: tanpa akses untuk anon; admin penuh.
drop policy if exists orders_admin_all on orders;
create policy orders_admin_all on orders
  for all to authenticated using (is_admin()) with check (is_admin());
drop policy if exists order_items_admin_all on order_items;
create policy order_items_admin_all on order_items
  for all to authenticated using (is_admin()) with check (is_admin());
drop policy if exists order_events_admin_all on order_events;
create policy order_events_admin_all on order_events
  for all to authenticated using (is_admin()) with check (is_admin());

-- admins dan lookup_attempts: sengaja tanpa kebijakan. Hanya service role
-- (route API) yang menyentuhnya; is_admin() membaca admins lewat security definer.

-- ---------------------------------------------------------------------
-- 9. Penyimpanan foto produk (Supabase Storage)
-- Publik untuk dibaca lewat URL; hanya admin yang boleh unggah, ubah, hapus.
-- Batas 2 MB per berkas, hanya JPEG, PNG, WebP.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-photos', 'product-photos', true, 2097152,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_photos_admin_select on storage.objects;
create policy product_photos_admin_select on storage.objects
  for select to authenticated
  using (bucket_id = 'product-photos' and public.is_admin());

drop policy if exists product_photos_admin_insert on storage.objects;
create policy product_photos_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-photos' and public.is_admin());

drop policy if exists product_photos_admin_update on storage.objects;
create policy product_photos_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'product-photos' and public.is_admin())
  with check (bucket_id = 'product-photos' and public.is_admin());

drop policy if exists product_photos_admin_delete on storage.objects;
create policy product_photos_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-photos' and public.is_admin());
