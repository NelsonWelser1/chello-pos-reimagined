
-- Add staff_id column to orders table to track who processed the order
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS staff_id uuid REFERENCES public.staff(id);

-- Create an index for better performance when querying orders by staff
CREATE INDEX IF NOT EXISTS idx_orders_staff_id ON public.orders(staff_id);

-- Add a comment to document the purpose
COMMENT ON COLUMN public.orders.staff_id IS 'References the staff member who processed/placed the order';
