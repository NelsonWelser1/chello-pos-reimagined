
-- Create the tables table for restaurant table management
CREATE TABLE public.tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE,
  seats INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')),
  shape TEXT NOT NULL CHECK (shape IN ('round', 'square', 'rectangle')),
  location TEXT NOT NULL,
  position_x INTEGER NOT NULL DEFAULT 0,
  position_y INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create the table_sessions table for tracking table occupancy
CREATE TABLE public.table_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  customer_name TEXT,
  party_size INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_tables_status ON public.tables(status);
CREATE INDEX idx_tables_location ON public.tables(location);
CREATE INDEX idx_table_sessions_table_id ON public.table_sessions(table_id);
CREATE INDEX idx_table_sessions_status ON public.table_sessions(status);

-- Add triggers for updating updated_at columns
CREATE OR REPLACE TRIGGER update_tables_updated_at
  BEFORE UPDATE ON public.tables
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_table_sessions_updated_at
  BEFORE UPDATE ON public.table_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (adjust based on your authentication needs)
CREATE POLICY "Allow public access to tables" ON public.tables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to table_sessions" ON public.table_sessions FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for live updates
ALTER TABLE public.tables REPLICA IDENTITY FULL;
ALTER TABLE public.table_sessions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.tables;
ALTER PUBLICATION supabase_realtime ADD TABLE public.table_sessions;
