-- First update any invalid modifier_type values to valid ones
UPDATE public.modifiers 
SET modifier_type = 'single' 
WHERE modifier_type NOT IN ('single', 'multiple', 'required');

-- Then add the constraint
ALTER TABLE public.modifiers 
ADD CONSTRAINT modifiers_modifier_type_check 
CHECK (modifier_type IN ('single', 'multiple', 'required'));

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_modifiers_category ON public.modifiers(category);
CREATE INDEX IF NOT EXISTS idx_modifiers_active ON public.modifiers(is_active);
CREATE INDEX IF NOT EXISTS idx_modifiers_sort_order ON public.modifiers(sort_order);