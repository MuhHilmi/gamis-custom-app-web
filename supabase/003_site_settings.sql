-- Pengaturan publik situs, termasuk tampilan landing page. Admin-only write.
create table if not exists site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create or replace function set_site_settings_updated_at() returns trigger
language plpgsql set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_site_settings_updated on site_settings;
create trigger trg_site_settings_updated
  before update on site_settings
  for each row execute function set_site_settings_updated_at();

alter table site_settings enable row level security;

grant select on site_settings to anon, authenticated;
grant insert, update, delete on site_settings to authenticated;

-- Publik hanya boleh membaca pengaturan landing page.
drop policy if exists site_settings_public_landing on site_settings;
create policy site_settings_public_landing on site_settings
  for select to anon, authenticated using (key = 'landing');

-- Admin bisa membaca dan mengubah semua pengaturan.
drop policy if exists site_settings_admin_all on site_settings;
create policy site_settings_admin_all on site_settings
  for all to authenticated using (is_admin()) with check (is_admin());