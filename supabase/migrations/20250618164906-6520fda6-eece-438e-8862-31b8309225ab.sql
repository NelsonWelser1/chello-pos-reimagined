
-- Create tables table for managing restaurant tables
CREATE TABLE public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL UNIQUE,
  seats INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'cleaning')),
  shape TEXT NOT NULL DEFAULT 'round' CHECK (shape IN ('round', 'square', 'rectangle')),
  location TEXT NOT NULL DEFAULT 'Main Floor',
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  party_size INTEGER NOT NULL,
  table_id UUID REFERENCES public.tables(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'cancelled', 'completed')),
  special_requests TEXT,
  duration_minutes INTEGER DEFAULT 120,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table_sessions table to track table occupancy
CREATE TABLE public.table_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.tables(id),
  customer_name TEXT,
  party_size INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add table_id to orders table to link orders to tables
ALTER TABLE public.orders 
ADD COLUMN table_session_id UUID REFERENCES public.table_sessions(id);

-- Create indexes for better performance
CREATE INDEX idx_tables_status ON public.tables(status);
CREATE INDEX idx_tables_number ON public.tables(number);
CREATE INDEX idx_reservations_date_time ON public.reservations(date, time);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_table_sessions_table_id ON public.table_sessions(table_id);
CREATE INDEX idx_table_sessions_status ON public.table_sessions(status);
CREATE INDEX idx_orders_table_session ON public.orders(table_session_id);

-- Add triggers for updated_at
CREATE TRIGGER update_tables_updated_at
BEFORE UPDATE ON public.tables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_table_sessions_updated_at
BEFORE UPDATE ON public.table_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create RLS policies
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to tables" ON public.tables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to reservations" ON public.reservations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to table_sessions" ON public.table_sessions FOR ALL USING (true) WITH CHECK (true);

-- Insert sample tables data
INSERT INTO public.tables (number, seats, status, shape, location, position_x, position_y, notes) VALUES
(1, 4, 'occupied', 'round', 'Main Floor', 10, 10, 'Window table'),
(2, 2, 'available', 'square', 'Main Floor', 200, 10, ''),
(3, 6, 'reserved', 'rectangle', 'Main Floor', 400, 10, 'Large party table'),
(4, 4, 'cleaning', 'round', 'Patio', 10, 150, 'Outdoor seating'),
(5, 8, 'available', 'rectangle', 'Private Room', 200, 150, 'VIP area'),
(6, 2, 'occupied', 'square', 'Bar Area', 400, 150, 'High top');

-- Insert sample reservations
INSERT INTO public.reservations (customer_name, phone, email, date, time, party_size, table_id, status, special_requests, duration_minutes) VALUES
('John Smith', '+1-555-0123', 'john@email.com', CURRENT_DATE, '19:00', 4, (SELECT id FROM public.tables WHERE number = 3), 'confirmed', 'Window seat preferred', 120),
('Sarah Johnson', '+1-555-0456', 'sarah@email.com', CURRENT_DATE, '20:30', 2, NULL, 'pending', 'Anniversary dinner', 90),
('Mike Wilson', '+1-555-0789', 'mike@email.com', CURRENT_DATE + 1, '18:00', 6, (SELECT id FROM public.tables WHERE number = 5), 'confirmed', 'Business dinner', 150);

-- Create active table sessions for occupied tables
INSERT INTO public.table_sessions (table_id, customer_name, party_size, notes) VALUES
((SELECT id FROM public.tables WHERE number = 1), 'Smith Party', 3, 'Celebrating birthday'),
((SELECT id FROM public.tables WHERE number = 6), 'Johnson Party', 2, 'Quick lunch');

-- Function to automatically update table status when session starts/ends
CREATE OR REPLACE FUNCTION public.update_table_status_on_session_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Mark table as occupied when session starts
    UPDATE public.tables 
    SET status = 'occupied' 
    WHERE id = NEW.table_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Mark table as available when session ends
    IF OLD.status = 'active' AND NEW.status = 'completed' THEN
      UPDATE public.tables 
      SET status = 'available' 
      WHERE id = NEW.table_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic table status updates
CREATE TRIGGER trigger_update_table_status
AFTER INSERT OR UPDATE ON public.table_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_table_status_on_session_change();
