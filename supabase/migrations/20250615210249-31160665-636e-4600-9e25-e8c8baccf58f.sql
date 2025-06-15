
-- This migration enables real-time updates for the 'staff' table.

-- By setting REPLICA IDENTITY to FULL, we ensure that Supabase Realtime
-- can capture all changes to rows in the staff table, including old values on UPDATE and DELETE.
ALTER TABLE public.staff REPLICA IDENTITY FULL;

-- This adds the 'staff' table to the 'supabase_realtime' publication.
-- The publication is what tells PostgreSQL which tables to send changes for
-- to logical replication subscribers, which is how Supabase Realtime works.
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff;
