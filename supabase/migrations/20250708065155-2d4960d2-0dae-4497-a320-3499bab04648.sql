
-- Add receipts table to Supabase types by creating the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.receipts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid NOT NULL,
    receipt_number text NOT NULL UNIQUE,
    receipt_data jsonb NOT NULL,
    printed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to receipts" ON public.receipts
    FOR ALL USING (true) WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_receipts_updated_at
    BEFORE UPDATE ON public.receipts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_receipts_order_id ON public.receipts(order_id);
CREATE INDEX IF NOT EXISTS idx_receipts_receipt_number ON public.receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at);
