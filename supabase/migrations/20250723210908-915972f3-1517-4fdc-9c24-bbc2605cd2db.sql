-- Create menu_item_ingredients table to link menu items with required ingredients
CREATE TABLE public.menu_item_ingredients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    quantity_required NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'units',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(menu_item_id, ingredient_id)
);

-- Enable RLS
ALTER TABLE public.menu_item_ingredients ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public access to menu_item_ingredients" 
ON public.menu_item_ingredients 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add trigger for timestamps
CREATE TRIGGER update_menu_item_ingredients_updated_at
BEFORE UPDATE ON public.menu_item_ingredients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to deduct ingredient stock when orders are completed
CREATE OR REPLACE FUNCTION public.deduct_ingredient_stock()
RETURNS TRIGGER AS $$
DECLARE
    item_record RECORD;
    ingredient_record RECORD;
BEGIN
    -- Only process when order status changes to 'completed'
    IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
        -- Loop through all order items for this order
        FOR item_record IN 
            SELECT oi.menu_item_id, oi.quantity 
            FROM public.order_items oi 
            WHERE oi.order_id = NEW.id
        LOOP
            -- Loop through all ingredients for this menu item
            FOR ingredient_record IN 
                SELECT mii.ingredient_id, mii.quantity_required 
                FROM public.menu_item_ingredients mii 
                WHERE mii.menu_item_id = item_record.menu_item_id
            LOOP
                -- Deduct the required quantity from ingredient stock
                UPDATE public.ingredients 
                SET current_stock = current_stock - (ingredient_record.quantity_required * item_record.quantity),
                    updated_at = now()
                WHERE id = ingredient_record.ingredient_id;
            END LOOP;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically deduct stock when orders are completed
CREATE TRIGGER deduct_ingredient_stock_trigger
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.deduct_ingredient_stock();

-- Create stock_adjustments table for manual stock management
CREATE TABLE public.stock_adjustments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('restock', 'waste', 'correction', 'transfer')),
    quantity_change NUMERIC NOT NULL,
    reason TEXT,
    performed_by_staff_id UUID REFERENCES public.staff(id),
    supplier TEXT,
    cost_per_unit NUMERIC DEFAULT 0,
    total_cost NUMERIC DEFAULT 0,
    reference_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for stock_adjustments
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;

-- Create policies for stock_adjustments
CREATE POLICY "Allow public access to stock_adjustments" 
ON public.stock_adjustments 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add trigger for timestamps
CREATE TRIGGER update_stock_adjustments_updated_at
BEFORE UPDATE ON public.stock_adjustments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update ingredient stock when adjustments are made
CREATE OR REPLACE FUNCTION public.apply_stock_adjustment()
RETURNS TRIGGER AS $$
BEGIN
    -- Update ingredient stock
    UPDATE public.ingredients 
    SET current_stock = current_stock + NEW.quantity_change,
        updated_at = now()
    WHERE id = NEW.ingredient_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically apply stock adjustments
CREATE TRIGGER apply_stock_adjustment_trigger
AFTER INSERT ON public.stock_adjustments
FOR EACH ROW
EXECUTE FUNCTION public.apply_stock_adjustment();