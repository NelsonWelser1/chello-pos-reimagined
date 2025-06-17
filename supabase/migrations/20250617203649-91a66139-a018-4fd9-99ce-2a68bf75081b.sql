
-- Create sales_transactions table to store all sales transactions
CREATE TABLE public.sales_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  order_id UUID REFERENCES public.orders(id),
  customer_id UUID REFERENCES public.customers(id),
  staff_id UUID REFERENCES public.staff(id),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  refund_amount NUMERIC DEFAULT 0,
  refund_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales_analytics table for performance tracking
CREATE TABLE public.sales_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_sales NUMERIC NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  average_order_value NUMERIC NOT NULL DEFAULT 0,
  total_customers INTEGER NOT NULL DEFAULT 0,
  peak_hour INTEGER,
  peak_hour_sales NUMERIC DEFAULT 0,
  staff_performance JSONB DEFAULT '[]'::jsonb,
  menu_performance JSONB DEFAULT '[]'::jsonb,
  payment_methods_breakdown JSONB DEFAULT '{}'::jsonb,
  hourly_sales JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Create sales_targets table for goal tracking
CREATE TABLE public.sales_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_name TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('daily', 'weekly', 'monthly', 'yearly')),
  target_amount NUMERIC NOT NULL,
  target_date DATE NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  achieved BOOLEAN DEFAULT FALSE,
  staff_id UUID REFERENCES public.staff(id),
  created_by UUID REFERENCES public.staff(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_sales_transactions_date ON public.sales_transactions(transaction_date);
CREATE INDEX idx_sales_transactions_staff ON public.sales_transactions(staff_id);
CREATE INDEX idx_sales_transactions_customer ON public.sales_transactions(customer_id);
CREATE INDEX idx_sales_analytics_date ON public.sales_analytics(date);
CREATE INDEX idx_sales_targets_date ON public.sales_targets(target_date);

-- Create trigger to update updated_at column
CREATE TRIGGER update_sales_transactions_updated_at
  BEFORE UPDATE ON public.sales_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_analytics_updated_at
  BEFORE UPDATE ON public.sales_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_targets_updated_at
  BEFORE UPDATE ON public.sales_targets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security (optional - can be enabled later if needed)
-- ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.sales_analytics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.sales_targets ENABLE ROW LEVEL SECURITY;

-- Create function to automatically create sales transaction when order is completed
CREATE OR REPLACE FUNCTION public.create_sales_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create transaction when order status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    INSERT INTO public.sales_transactions (
      transaction_id,
      order_id,
      customer_id,
      staff_id,
      total_amount,
      subtotal,
      tax_amount,
      payment_method,
      payment_status,
      transaction_date
    ) VALUES (
      'TXN-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('sales_transaction_seq')::TEXT, 6, '0'),
      NEW.id,
      NEW.customer_id,
      NEW.staff_id,
      NEW.total_amount,
      NEW.subtotal,
      NEW.tax_amount,
      NEW.payment_method,
      'completed',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for transaction IDs
CREATE SEQUENCE IF NOT EXISTS sales_transaction_seq START 1;

-- Create trigger to auto-create sales transactions
CREATE TRIGGER create_sales_transaction_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.create_sales_transaction();

-- Create function to update daily analytics
CREATE OR REPLACE FUNCTION public.update_daily_analytics()
RETURNS TRIGGER AS $$
DECLARE
  analytics_date DATE := NEW.transaction_date::DATE;
  hourly_data JSONB;
BEGIN
  -- Update or insert daily analytics
  INSERT INTO public.sales_analytics (
    date,
    total_sales,
    total_orders,
    average_order_value,
    total_customers
  ) VALUES (
    analytics_date,
    NEW.total_amount,
    1,
    NEW.total_amount,
    1
  )
  ON CONFLICT (date) DO UPDATE SET
    total_sales = sales_analytics.total_sales + NEW.total_amount,
    total_orders = sales_analytics.total_orders + 1,
    average_order_value = (sales_analytics.total_sales + NEW.total_amount) / (sales_analytics.total_orders + 1),
    total_customers = sales_analytics.total_customers + 
      CASE WHEN NEW.customer_id IS NOT NULL THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics updates
CREATE TRIGGER update_daily_analytics_trigger
  AFTER INSERT ON public.sales_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_analytics();
