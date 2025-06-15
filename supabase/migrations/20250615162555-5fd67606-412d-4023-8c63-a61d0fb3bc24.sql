
-- Create the categories table in Supabase
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text not null default '#3b82f6',
  is_active boolean not null default true,
  created_at date not null default current_date,
  updated_at date not null default current_date
);

-- Add RLS so only authenticated users can select/update/insert/delete
alter table public.categories enable row level security;

create policy "Authenticated can do everything"
  on public.categories
  for all
  to authenticated
  using (true)
  with check (true);
