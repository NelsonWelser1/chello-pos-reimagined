-- Update currency defaults from USD to UGX
UPDATE public.payment_methods SET currency = 'UGX' WHERE currency = 'USD';
UPDATE public.payment_gateways SET supported_currencies = ARRAY['UGX'] WHERE supported_currencies = ARRAY['USD'];
UPDATE public.payment_method_transactions SET currency = 'UGX' WHERE currency = 'USD';

-- Update default currency configuration
UPDATE public.payment_configurations 
SET setting_value = '"UGX"' 
WHERE setting_key = 'default_currency' AND setting_value = '"USD"';

-- Alter table defaults for future records
ALTER TABLE public.payment_methods ALTER COLUMN currency SET DEFAULT 'UGX';
ALTER TABLE public.payment_gateways ALTER COLUMN supported_currencies SET DEFAULT ARRAY['UGX'];
ALTER TABLE public.payment_method_transactions ALTER COLUMN currency SET DEFAULT 'UGX';