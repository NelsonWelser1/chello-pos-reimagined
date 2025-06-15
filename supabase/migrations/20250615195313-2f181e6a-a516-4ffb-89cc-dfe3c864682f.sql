
CREATE TABLE public.expense_types (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    budget_limit numeric NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    color text NOT NULL DEFAULT '#3B82F6',
    tax_deductible boolean NOT NULL DEFAULT true,
    requires_approval boolean NOT NULL DEFAULT false,
    approval_threshold numeric NOT NULL DEFAULT 1000,
    auto_recurring boolean NOT NULL DEFAULT false,
    default_vendors text[],
    gl_code text,
    cost_center text,
    priority text NOT NULL DEFAULT 'Medium',
    budget_period text NOT NULL DEFAULT 'Monthly',
    notification_threshold integer NOT NULL DEFAULT 80,
    allow_over_budget boolean NOT NULL DEFAULT false,
    restricted_users text[],
    tags text[],
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expense_types ENABLE ROW LEVEL SECURITY;

-- Create a policy for public access since authentication is disabled for now
CREATE POLICY "Public access for expense_types" ON public.expense_types
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create a trigger to automatically update the 'updated_at' timestamp
CREATE TRIGGER handle_expense_types_updated_at
    BEFORE UPDATE ON public.expense_types
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
