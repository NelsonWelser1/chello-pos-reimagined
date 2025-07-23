-- Update expense_types table with proper constraints
UPDATE public.expense_types 
SET budget_period = 'Monthly' 
WHERE budget_period NOT IN ('Monthly', 'Quarterly', 'Yearly');

UPDATE public.expense_types 
SET priority = 'Medium' 
WHERE priority NOT IN ('Low', 'Medium', 'High');

-- Add constraints
ALTER TABLE public.expense_types 
ADD CONSTRAINT expense_types_budget_period_check 
CHECK (budget_period IN ('Monthly', 'Quarterly', 'Yearly'));

ALTER TABLE public.expense_types 
ADD CONSTRAINT expense_types_priority_check 
CHECK (priority IN ('Low', 'Medium', 'High'));

ALTER TABLE public.expense_types 
ADD CONSTRAINT expense_types_positive_budget 
CHECK (budget_limit >= 0);

-- Create additional indexes
CREATE INDEX IF NOT EXISTS idx_expense_types_category ON public.expense_types(category);
CREATE INDEX IF NOT EXISTS idx_expense_types_active ON public.expense_types(is_active);
CREATE INDEX IF NOT EXISTS idx_expense_types_priority ON public.expense_types(priority);