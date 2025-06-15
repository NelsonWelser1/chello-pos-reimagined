
-- Create the modifiers table
CREATE TABLE public.modifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC DEFAULT 0,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    applicable_items TEXT[] DEFAULT '{}',
    modifier_type TEXT NOT NULL,
    max_quantity INT DEFAULT 1,
    is_required BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to update 'updated_at' timestamp on any row modification
CREATE TRIGGER update_modifiers_updated_at
BEFORE UPDATE ON public.modifiers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (RLS) for the table
ALTER TABLE public.modifiers ENABLE ROW LEVEL SECURITY;

-- Since we don't have users yet, we'll allow public access for now.
-- This allows anyone to read, create, update, and delete modifiers.
CREATE POLICY "Allow public read access" ON public.modifiers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.modifiers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.modifiers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.modifiers FOR DELETE USING (true);
