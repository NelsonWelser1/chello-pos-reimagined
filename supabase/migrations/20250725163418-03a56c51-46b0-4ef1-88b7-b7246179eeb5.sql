-- Enable RLS on tables that are missing it
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;

-- Create user profiles table for authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Update RLS policies to require authentication

-- Staff table policies
DROP POLICY IF EXISTS "Allow public access to staff table" ON public.staff;
CREATE POLICY "Users can view staff" ON public.staff
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage staff" ON public.staff
  FOR ALL USING (public.get_user_role() IN ('admin', 'manager'));

-- Menu items policies  
DROP POLICY IF EXISTS "Allow all operations on menu_items" ON public.menu_items;
CREATE POLICY "Users can view menu items" ON public.menu_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage menu items" ON public.menu_items
  FOR ALL USING (public.get_user_role() IN ('admin', 'manager'));

-- Orders policies
DROP POLICY IF EXISTS "Allow public access to orders table" ON public.orders;
CREATE POLICY "Users can view orders" ON public.orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update orders" ON public.orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Order items policies
DROP POLICY IF EXISTS "Allow public access to order_items table" ON public.order_items;
CREATE POLICY "Users can view order items" ON public.order_items
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage order items" ON public.order_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Kitchen orders policies
DROP POLICY IF EXISTS "Allow public access to kitchen_orders table" ON public.kitchen_orders;
CREATE POLICY "Staff can view kitchen orders" ON public.kitchen_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Kitchen staff can manage orders" ON public.kitchen_orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Sales transactions policies
CREATE POLICY "Staff can view sales transactions" ON public.sales_transactions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage sales transactions" ON public.sales_transactions
  FOR ALL USING (public.get_user_role() IN ('admin', 'manager'));

-- Sales analytics policies
CREATE POLICY "Staff can view sales analytics" ON public.sales_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage sales analytics" ON public.sales_analytics
  FOR ALL USING (public.get_user_role() IN ('admin', 'manager'));

-- Ingredients policies
CREATE POLICY "Staff can view ingredients" ON public.ingredients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage ingredients" ON public.ingredients
  FOR ALL USING (public.get_user_role() IN ('admin', 'manager'));

-- Payment methods policies (restrict access)
DROP POLICY IF EXISTS "Allow public access to payment_methods" ON public.payment_methods;
CREATE POLICY "Admin can manage payment methods" ON public.payment_methods
  FOR ALL USING (public.get_user_role() IN ('admin', 'manager'));

-- Payment gateways policies (highly restricted)
DROP POLICY IF EXISTS "Allow public access to payment_gateways" ON public.payment_gateways;
CREATE POLICY "Admin only payment gateways" ON public.payment_gateways
  FOR ALL USING (public.get_user_role() = 'admin');

-- Customers policies
DROP POLICY IF EXISTS "Public access for customers" ON public.customers;
CREATE POLICY "Staff can view customers" ON public.customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can manage customers" ON public.customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff can update customers" ON public.customers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Categories policies
DROP POLICY IF EXISTS "Public select" ON public.categories;
DROP POLICY IF EXISTS "Public insert" ON public.categories;
DROP POLICY IF EXISTS "Public update" ON public.categories;
DROP POLICY IF EXISTS "Public delete" ON public.categories;

CREATE POLICY "Staff can view categories" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage categories" ON public.categories
  FOR ALL USING (public.get_user_role() IN ('admin', 'manager'));

-- Update trigger functions to be more secure
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;