
CREATE TABLE public.ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT NOT NULL,
    current_stock NUMERIC DEFAULT 0,
    minimum_stock NUMERIC DEFAULT 0,
    maximum_stock NUMERIC DEFAULT 0,
    cost_per_unit NUMERIC DEFAULT 0,
    supplier TEXT,
    supplier_contact TEXT,
    expiry_date DATE,
    last_restocked DATE,
    is_perishable BOOLEAN DEFAULT false,
    storage_location TEXT,
    allergens TEXT[] DEFAULT '{}',
    nutritional_calories NUMERIC DEFAULT 0,
    nutritional_protein NUMERIC DEFAULT 0,
    nutritional_carbs NUMERIC DEFAULT 0,
    nutritional_fat NUMERIC DEFAULT 0,
    nutritional_fiber NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER update_ingredients_updated_at
BEFORE UPDATE ON public.ingredients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
