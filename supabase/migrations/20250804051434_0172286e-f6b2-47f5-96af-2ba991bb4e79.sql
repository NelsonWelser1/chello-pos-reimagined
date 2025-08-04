-- Create user permissions table
CREATE TABLE public.user_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES public.staff(id) ON DELETE CASCADE,
  module_access JSONB NOT NULL DEFAULT '{}',
  system_access BOOLEAN NOT NULL DEFAULT true,
  can_create_users BOOLEAN NOT NULL DEFAULT false,
  can_delete_users BOOLEAN NOT NULL DEFAULT false,
  can_manage_permissions BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_permissions
CREATE POLICY "Admin can manage user permissions" 
ON public.user_permissions 
FOR ALL 
USING (get_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Users can view their own permissions" 
ON public.user_permissions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_uuid UUID DEFAULT auth.uid())
RETURNS JSONB
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_build_object(
      'module_access', module_access,
      'system_access', system_access,
      'can_create_users', can_create_users,
      'can_delete_users', can_delete_users,
      'can_manage_permissions', can_manage_permissions
    ), 
    '{"module_access": {}, "system_access": true, "can_create_users": false, "can_delete_users": false, "can_manage_permissions": false}'::jsonb
  )
  FROM public.user_permissions 
  WHERE user_id = user_uuid;
$$;

-- Create function to check module access
CREATE OR REPLACE FUNCTION public.has_module_access(module_name TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT (module_access->module_name)::boolean FROM public.user_permissions WHERE user_id = user_uuid),
    true
  );
$$;

-- Update staff table to include auth_user_id
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create trigger to update user_permissions updated_at
CREATE TRIGGER update_user_permissions_updated_at
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default permissions for existing staff with auth users
INSERT INTO public.user_permissions (user_id, staff_id, system_access, module_access)
SELECT 
  p.id as user_id,
  s.id as staff_id,
  true as system_access,
  '{"dashboard": true, "pos": true, "kitchen": true, "items": true, "modifiers": true, "categories": true, "ingredients": true, "customers": true, "orders": true, "service-tables": true, "sales": true, "stock-alert": true, "payment-methods": true, "expenses": true, "expense-types": true, "staff": false, "backup": false, "imports-exports": false}'::jsonb as module_access
FROM public.profiles p
JOIN public.staff s ON s.email = p.email
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_permissions up WHERE up.user_id = p.id
)
ON CONFLICT (user_id) DO NOTHING;