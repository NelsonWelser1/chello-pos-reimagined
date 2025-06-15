
-- Create the menu_items table with all fields from the ItemForm
CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  image TEXT,
  stock_count INTEGER NOT NULL DEFAULT 0,
  low_stock_alert INTEGER NOT NULL DEFAULT 5,
  allergens TEXT[] DEFAULT '{}',
  modifiers TEXT[] DEFAULT '{}',
  preparation_time INTEGER NOT NULL DEFAULT 5,
  calories INTEGER DEFAULT 0,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index on category for faster filtering
CREATE INDEX idx_menu_items_category ON public.menu_items(category);

-- Create an index on is_available for faster queries
CREATE INDEX idx_menu_items_available ON public.menu_items(is_available);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON public.menu_items 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- Since authentication is temporarily disabled, we'll make the table publicly accessible
-- Note: In production, you should implement proper RLS policies
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Temporarily allow all operations without authentication
CREATE POLICY "Allow all operations on menu_items" 
  ON public.menu_items 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
