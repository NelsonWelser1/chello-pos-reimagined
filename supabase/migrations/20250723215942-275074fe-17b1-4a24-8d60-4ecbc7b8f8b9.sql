-- Create backup_configurations table
CREATE TABLE public.backup_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  backup_type TEXT NOT NULL, -- 'full', 'incremental', 'differential'
  schedule_type TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'daily', 'weekly', 'monthly'
  schedule_time TIME,
  schedule_day INTEGER, -- For weekly (1-7) or monthly (1-31)
  tables_included TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  exclude_tables TEXT[] DEFAULT ARRAY[]::TEXT[],
  retention_days INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  compression_enabled BOOLEAN NOT NULL DEFAULT true,
  encryption_enabled BOOLEAN NOT NULL DEFAULT false,
  storage_location TEXT NOT NULL DEFAULT 'local', -- 'local', 's3', 'gcs'
  storage_config JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES public.staff(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create backup_history table
CREATE TABLE public.backup_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  configuration_id UUID REFERENCES public.backup_configurations(id) ON DELETE SET NULL,
  backup_name TEXT NOT NULL,
  backup_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  file_path TEXT,
  file_size BIGINT, -- in bytes
  compression_ratio NUMERIC,
  records_count INTEGER,
  tables_backed_up TEXT[],
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  error_message TEXT,
  checksum TEXT, -- for integrity verification
  initiated_by UUID REFERENCES public.staff(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create restore_history table
CREATE TABLE public.restore_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_history_id UUID NOT NULL REFERENCES public.backup_history(id) ON DELETE CASCADE,
  restore_name TEXT NOT NULL,
  restore_type TEXT NOT NULL DEFAULT 'full', -- 'full', 'partial', 'table_specific'
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  tables_restored TEXT[],
  records_restored INTEGER,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  error_message TEXT,
  initiated_by UUID REFERENCES public.staff(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create backup_schedules table for tracking scheduled jobs
CREATE TABLE public.backup_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  configuration_id UUID NOT NULL REFERENCES public.backup_configurations(id) ON DELETE CASCADE,
  next_run_time TIMESTAMP WITH TIME ZONE NOT NULL,
  last_run_time TIMESTAMP WITH TIME ZONE,
  last_run_status TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  failure_count INTEGER NOT NULL DEFAULT 0,
  max_failures INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.backup_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restore_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public access to backup_configurations" 
ON public.backup_configurations 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to backup_history" 
ON public.backup_history 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to restore_history" 
ON public.restore_history 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public access to backup_schedules" 
ON public.backup_schedules 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_backup_configurations_active ON public.backup_configurations(is_active);
CREATE INDEX idx_backup_configurations_schedule ON public.backup_configurations(schedule_type);
CREATE INDEX idx_backup_history_status ON public.backup_history(status);
CREATE INDEX idx_backup_history_config ON public.backup_history(configuration_id);
CREATE INDEX idx_backup_history_start_time ON public.backup_history(start_time);
CREATE INDEX idx_restore_history_status ON public.restore_history(status);
CREATE INDEX idx_restore_history_backup ON public.restore_history(backup_history_id);
CREATE INDEX idx_backup_schedules_next_run ON public.backup_schedules(next_run_time);
CREATE INDEX idx_backup_schedules_enabled ON public.backup_schedules(is_enabled);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_backup_configurations_updated_at
BEFORE UPDATE ON public.backup_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_backup_history_updated_at
BEFORE UPDATE ON public.backup_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restore_history_updated_at
BEFORE UPDATE ON public.restore_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_backup_schedules_updated_at
BEFORE UPDATE ON public.backup_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default backup configurations
INSERT INTO public.backup_configurations (
  name, 
  description, 
  backup_type, 
  schedule_type, 
  schedule_time,
  tables_included,
  retention_days
) VALUES 
('Daily Full Backup', 'Complete daily backup of all restaurant data', 'full', 'daily', '02:00:00', 
 ARRAY['menu_items', 'orders', 'order_items', 'customers', 'staff', 'ingredients', 'sales_transactions'], 30),
 
('Weekly Menu Backup', 'Weekly backup of menu and inventory data', 'full', 'weekly', '01:00:00',
 ARRAY['menu_items', 'ingredients', 'modifiers', 'categories'], 60),
 
('Monthly Archive', 'Monthly comprehensive backup for long-term storage', 'full', 'monthly', '00:30:00',
 ARRAY['menu_items', 'orders', 'order_items', 'customers', 'staff', 'ingredients', 'sales_transactions', 'expenses', 'expense_types'], 365);