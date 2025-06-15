
-- Temporarily update RLS policies to allow public access for development/testing

-- 1. Remove existing policies (if any)
drop policy if exists "Authenticated can do everything" on public.categories;

-- 2. Allow any user to select/insert/update/delete
create policy "Public select" on public.categories for select using (true);
create policy "Public insert" on public.categories for insert with check (true);
create policy "Public update" on public.categories for update using (true);
create policy "Public delete" on public.categories for delete using (true);
