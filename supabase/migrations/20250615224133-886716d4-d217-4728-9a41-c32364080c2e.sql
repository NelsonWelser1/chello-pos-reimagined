
-- Create kitchen_orders table to track kitchen workflow
CREATE TABLE public.kitchen_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'served')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    estimated_time INTEGER NOT NULL DEFAULT 15,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_completion_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kitchen_order_items table to track individual item preparation
CREATE TABLE public.kitchen_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kitchen_order_id UUID NOT NULL REFERENCES public.kitchen_orders(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready')),
    prep_time INTEGER NOT NULL DEFAULT 5,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add triggers for updated_at
CREATE TRIGGER update_kitchen_orders_updated_at
BEFORE UPDATE ON public.kitchen_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kitchen_order_items_updated_at
BEFORE UPDATE ON public.kitchen_order_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create RLS policies
ALTER TABLE public.kitchen_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to kitchen_orders table" 
ON public.kitchen_orders
FOR ALL
USING (true)
WITH CHECK (true);

ALTER TABLE public.kitchen_order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access to kitchen_order_items table" 
ON public.kitchen_order_items
FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_kitchen_orders_status ON public.kitchen_orders(status);
CREATE INDEX idx_kitchen_orders_priority ON public.kitchen_orders(priority);
CREATE INDEX idx_kitchen_orders_created_at ON public.kitchen_orders(created_at);
CREATE INDEX idx_kitchen_order_items_status ON public.kitchen_order_items(status);

-- Enable realtime for kitchen orders
ALTER TABLE public.kitchen_orders REPLICA IDENTITY FULL;
ALTER TABLE public.kitchen_order_items REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kitchen_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.kitchen_order_items;
