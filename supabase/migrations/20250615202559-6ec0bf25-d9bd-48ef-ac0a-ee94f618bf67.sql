
-- Create a new ENUM type for staff roles
CREATE TYPE public.staff_role AS ENUM ('Admin', 'Manager', 'Chef', 'Waiter', 'Cashier');

-- Create the staff table
CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role public.staff_role NOT NULL DEFAULT 'Waiter',
    is_active BOOLEAN NOT NULL DEFAULT true,
    pin_code TEXT,
    hourly_rate NUMERIC(10, 2)
);

-- Enable Row Level Security
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view all staff members
CREATE POLICY "Allow authenticated users to view staff"
ON public.staff
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to manage staff members
-- For a more secure application, you would restrict INSERT, UPDATE, DELETE to users with an 'Admin' or 'Manager' role.
CREATE POLICY "Allow authenticated users to manage staff"
ON public.staff
FOR ALL -- covers INSERT, UPDATE, DELETE
TO authenticated
USING (true);

-- Create a trigger to automatically update the 'updated_at' column
CREATE TRIGGER handle_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
