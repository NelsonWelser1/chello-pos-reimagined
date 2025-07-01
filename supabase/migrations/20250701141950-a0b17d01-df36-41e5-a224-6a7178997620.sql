
-- Create payment methods table
CREATE TABLE public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'mobile', 'cash', 'gift', 'bank_transfer', 'crypto')),
  provider TEXT,
  processing_fee_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  processing_fee_fixed DECIMAL(10,2) NOT NULL DEFAULT 0,
  daily_limit DECIMAL(15,2),
  monthly_limit DECIMAL(15,2),
  enabled BOOLEAN NOT NULL DEFAULT true,
  requires_verification BOOLEAN NOT NULL DEFAULT false,
  auto_settlement BOOLEAN NOT NULL DEFAULT true,
  currency TEXT NOT NULL DEFAULT 'USD',
  description TEXT,
  api_key TEXT,
  webhook_url TEXT,
  merchant_id TEXT,
  terminal_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment gateways table
CREATE TABLE public.payment_gateways (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'square', 'paypal', 'authorize_net', 'braintree', 'adyen', 'worldpay')),
  environment TEXT NOT NULL CHECK (environment IN ('sandbox', 'production')),
  api_key TEXT NOT NULL,
  secret_key TEXT NOT NULL,
  webhook_url TEXT,
  webhook_secret TEXT,
  merchant_id TEXT,
  public_key TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
  supported_currencies TEXT[] NOT NULL DEFAULT ARRAY['USD'],
  max_transaction_amount DECIMAL(15,2),
  min_transaction_amount DECIMAL(15,2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment rules table
CREATE TABLE public.payment_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('fraud_detection', 'amount_limit', 'geographic', 'time_based', 'velocity', 'blacklist')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 50 CHECK (priority >= 1 AND priority <= 100),
  conditions JSONB NOT NULL DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  description TEXT,
  applies_to_methods TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_amount DECIMAL(15,2),
  min_amount DECIMAL(15,2),
  allowed_countries TEXT[] DEFAULT ARRAY[]::TEXT[],
  blocked_countries TEXT[] DEFAULT ARRAY[]::TEXT[],
  time_restrictions JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment configurations table for system-wide settings
CREATE TABLE public.payment_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL CHECK (setting_type IN ('global', 'gateway_specific', 'method_specific')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment method transactions table for detailed transaction tracking
CREATE TABLE public.payment_method_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE,
  payment_method_id UUID REFERENCES public.payment_methods(id),
  gateway_id UUID REFERENCES public.payment_gateways(id),
  order_id UUID,
  customer_id UUID,
  staff_id UUID,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  fee_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  net_amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
  gateway_transaction_id TEXT,
  gateway_reference TEXT,
  response_data JSONB,
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment fraud logs table
CREATE TABLE public.payment_fraud_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.payment_method_transactions(id),
  rule_id UUID REFERENCES public.payment_rules(id),
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  fraud_indicators JSONB,
  action_taken TEXT NOT NULL CHECK (action_taken IN ('allowed', 'flagged', 'blocked', 'manual_review')),
  reviewer_id UUID,
  review_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment refunds table
CREATE TABLE public.payment_refunds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_transaction_id UUID REFERENCES public.payment_method_transactions(id) NOT NULL,
  refund_transaction_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(15,2) NOT NULL,
  reason TEXT NOT NULL,
  refund_type TEXT NOT NULL CHECK (refund_type IN ('full', 'partial')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  gateway_refund_id TEXT,
  requested_by UUID,
  approved_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_payment_methods_type ON public.payment_methods(type);
CREATE INDEX idx_payment_methods_enabled ON public.payment_methods(enabled);
CREATE INDEX idx_payment_gateways_provider ON public.payment_gateways(provider);
CREATE INDEX idx_payment_gateways_enabled ON public.payment_gateways(enabled);
CREATE INDEX idx_payment_rules_type ON public.payment_rules(rule_type);
CREATE INDEX idx_payment_rules_enabled ON public.payment_rules(enabled);
CREATE INDEX idx_payment_method_transactions_status ON public.payment_method_transactions(status);
CREATE INDEX idx_payment_method_transactions_created_at ON public.payment_method_transactions(created_at);
CREATE INDEX idx_payment_fraud_logs_risk_score ON public.payment_fraud_logs(risk_score);
CREATE INDEX idx_payment_refunds_status ON public.payment_refunds(status);

-- Add triggers for updating updated_at columns
CREATE OR REPLACE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_payment_gateways_updated_at
  BEFORE UPDATE ON public.payment_gateways
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_payment_rules_updated_at
  BEFORE UPDATE ON public.payment_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_payment_configurations_updated_at
  BEFORE UPDATE ON public.payment_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_payment_method_transactions_updated_at
  BEFORE UPDATE ON public.payment_method_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_payment_refunds_updated_at
  BEFORE UPDATE ON public.payment_refunds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_method_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_fraud_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_refunds ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (adjust based on your authentication needs)
CREATE POLICY "Allow public access to payment_methods" ON public.payment_methods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to payment_gateways" ON public.payment_gateways FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to payment_rules" ON public.payment_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to payment_configurations" ON public.payment_configurations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to payment_method_transactions" ON public.payment_method_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to payment_fraud_logs" ON public.payment_fraud_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to payment_refunds" ON public.payment_refunds FOR ALL USING (true) WITH CHECK (true);

-- Insert some default payment configurations
INSERT INTO public.payment_configurations (setting_key, setting_value, setting_type, description) VALUES
('global_fraud_threshold', '{"risk_score": 75, "auto_block": true}', 'global', 'Global fraud detection threshold settings'),
('default_currency', '"USD"', 'global', 'Default currency for transactions'),
('max_daily_refunds', '{"amount": 10000, "count": 50}', 'global', 'Maximum daily refund limits'),
('payment_retry_attempts', '3', 'global', 'Number of retry attempts for failed payments'),
('settlement_schedule', '{"frequency": "daily", "time": "02:00"}', 'global', 'Automatic settlement schedule');

-- Enable realtime for live updates
ALTER TABLE public.payment_methods REPLICA IDENTITY FULL;
ALTER TABLE public.payment_gateways REPLICA IDENTITY FULL;
ALTER TABLE public.payment_rules REPLICA IDENTITY FULL;
ALTER TABLE public.payment_method_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.payment_fraud_logs REPLICA IDENTITY FULL;
ALTER TABLE public.payment_refunds REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_methods;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_gateways;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_rules;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_method_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_fraud_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_refunds;
