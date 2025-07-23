-- Create pickup_points table
CREATE TABLE public.pickup_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  coordinates JSONB, -- {lat: number, lng: number}
  phone TEXT,
  email TEXT,
  opening_hours JSONB DEFAULT '[]'::jsonb, -- [{day: string, open: string, close: string, closed: boolean}]
  capacity INTEGER NOT NULL DEFAULT 10,
  current_orders INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  delivery_radius NUMERIC DEFAULT 5.0, -- in kilometers
  special_instructions TEXT,
  facilities TEXT[], -- ['parking', 'wheelchair_access', 'restroom']
  manager_name TEXT,
  manager_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pickup_orders table for tracking orders at pickup points
CREATE TABLE public.pickup_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  pickup_point_id UUID NOT NULL REFERENCES public.pickup_points(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  estimated_pickup_time TIMESTAMP WITH TIME ZONE,
  actual_pickup_time TIMESTAMP WITH TIME ZONE,
  pickup_code TEXT NOT NULL UNIQUE, -- 6-digit code for customer verification
  status TEXT NOT NULL DEFAULT 'preparing', -- preparing, ready, picked_up, expired
  special_instructions TEXT,
  assigned_staff_id UUID REFERENCES public.staff(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pickup_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public access to pickup_points" 
ON public.pickup_points 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to pickup_orders" 
ON public.pickup_orders 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_pickup_points_active ON public.pickup_points(is_active);
CREATE INDEX idx_pickup_points_coordinates ON public.pickup_points USING gin(coordinates);
CREATE INDEX idx_pickup_orders_pickup_point ON public.pickup_orders(pickup_point_id);
CREATE INDEX idx_pickup_orders_status ON public.pickup_orders(status);
CREATE INDEX idx_pickup_orders_pickup_code ON public.pickup_orders(pickup_code);
CREATE INDEX idx_pickup_orders_estimated_time ON public.pickup_orders(estimated_pickup_time);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_pickup_points_updated_at
BEFORE UPDATE ON public.pickup_points
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pickup_orders_updated_at
BEFORE UPDATE ON public.pickup_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique pickup codes
CREATE OR REPLACE FUNCTION public.generate_pickup_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-digit random code
    code := LPAD(FLOOR(random() * 999999)::TEXT, 6, '0');
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.pickup_orders WHERE pickup_code = code) INTO exists_check;
    
    -- Exit loop if code is unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql;