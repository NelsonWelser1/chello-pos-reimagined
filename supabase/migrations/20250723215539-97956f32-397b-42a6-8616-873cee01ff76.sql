-- Create import_export_history table
CREATE TABLE public.import_export_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type TEXT NOT NULL, -- 'import' or 'export'
  data_type TEXT NOT NULL, -- 'menu_items', 'customers', 'orders', 'staff', etc.
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_path TEXT, -- for stored files
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  records_processed INTEGER DEFAULT 0,
  records_total INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_details JSONB DEFAULT '[]'::jsonb, -- Array of error objects
  validation_errors JSONB DEFAULT '[]'::jsonb,
  processing_time INTEGER, -- in seconds
  initiated_by UUID REFERENCES public.staff(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  download_url TEXT, -- for exports
  download_expires_at TIMESTAMP WITH TIME ZONE,
  settings JSONB DEFAULT '{}'::jsonb, -- export/import settings
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create data_templates table for import templates
CREATE TABLE public.data_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  data_type TEXT NOT NULL,
  description TEXT,
  template_structure JSONB NOT NULL, -- Column definitions and validation rules
  sample_data JSONB DEFAULT '[]'::jsonb,
  is_system_template BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.staff(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create import_mappings table for field mapping
CREATE TABLE public.import_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  import_history_id UUID NOT NULL REFERENCES public.import_export_history(id) ON DELETE CASCADE,
  source_field TEXT NOT NULL,
  target_field TEXT NOT NULL,
  data_transformation TEXT, -- JSON path or function name for data transformation
  is_required BOOLEAN NOT NULL DEFAULT false,
  default_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.import_export_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_mappings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public access to import_export_history" 
ON public.import_export_history 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to data_templates" 
ON public.data_templates 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to import_mappings" 
ON public.import_mappings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_import_export_history_type ON public.import_export_history(operation_type);
CREATE INDEX idx_import_export_history_data_type ON public.import_export_history(data_type);
CREATE INDEX idx_import_export_history_status ON public.import_export_history(status);
CREATE INDEX idx_import_export_history_initiated_by ON public.import_export_history(initiated_by);
CREATE INDEX idx_import_export_history_created_at ON public.import_export_history(created_at);

CREATE INDEX idx_data_templates_data_type ON public.data_templates(data_type);
CREATE INDEX idx_data_templates_active ON public.data_templates(is_active);

CREATE INDEX idx_import_mappings_import_history ON public.import_mappings(import_history_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_import_export_history_updated_at
BEFORE UPDATE ON public.import_export_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_data_templates_updated_at
BEFORE UPDATE ON public.data_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default data templates
INSERT INTO public.data_templates (name, data_type, description, template_structure, sample_data, is_system_template) VALUES
('Menu Items Template', 'menu_items', 'Standard template for importing menu items', 
 '{"required_fields": ["name", "price", "category"], "optional_fields": ["description", "image", "allergens", "is_vegetarian", "preparation_time"], "validation_rules": {"price": {"type": "number", "min": 0}, "preparation_time": {"type": "number", "min": 1}}}',
 '[{"name": "Burger", "price": 15000, "category": "Main Course", "description": "Delicious beef burger", "preparation_time": 15}]',
 true),
 
('Customers Template', 'customers', 'Standard template for importing customers',
 '{"required_fields": ["name"], "optional_fields": ["email", "phone", "address"], "validation_rules": {"email": {"type": "email"}, "phone": {"type": "string"}}}',
 '[{"name": "John Doe", "email": "john@example.com", "phone": "+256700000000"}]',
 true),
 
('Staff Template', 'staff', 'Standard template for importing staff members',
 '{"required_fields": ["name", "email", "role"], "optional_fields": ["phone", "hourly_rate", "pin_code"], "validation_rules": {"email": {"type": "email"}, "role": {"enum": ["Admin", "Manager", "Chef", "Waiter", "Cashier"]}, "hourly_rate": {"type": "number", "min": 0}}}',
 '[{"name": "Jane Smith", "email": "jane@restaurant.com", "role": "Waiter", "hourly_rate": 15000}]',
 true),
 
('Ingredients Template', 'ingredients', 'Standard template for importing ingredients',
 '{"required_fields": ["name", "category", "unit"], "optional_fields": ["current_stock", "minimum_stock", "cost_per_unit", "supplier", "expiry_date"], "validation_rules": {"current_stock": {"type": "number", "min": 0}, "minimum_stock": {"type": "number", "min": 0}, "cost_per_unit": {"type": "number", "min": 0}}}',
 '[{"name": "Tomatoes", "category": "Vegetables", "unit": "kg", "current_stock": 50, "minimum_stock": 10, "cost_per_unit": 3000}]',
 true);