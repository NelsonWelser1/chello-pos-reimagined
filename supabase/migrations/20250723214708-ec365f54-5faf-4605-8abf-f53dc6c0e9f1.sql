-- Add constraints and indexes for ingredients table
CREATE INDEX IF NOT EXISTS idx_ingredients_category ON public.ingredients(category);
CREATE INDEX IF NOT EXISTS idx_ingredients_low_stock ON public.ingredients(current_stock) 
WHERE current_stock <= minimum_stock;
CREATE INDEX IF NOT EXISTS idx_ingredients_expiry ON public.ingredients(expiry_date) 
WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ingredients_supplier ON public.ingredients(supplier);

-- Add constraint for positive stock values
ALTER TABLE public.ingredients 
ADD CONSTRAINT ingredients_positive_stock 
CHECK (current_stock >= 0 AND minimum_stock >= 0);