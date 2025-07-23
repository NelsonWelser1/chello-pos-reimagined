-- Add indexes and constraints for staff table
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_active ON public.staff(is_active);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);

-- Ensure email uniqueness
ALTER TABLE public.staff 
ADD CONSTRAINT staff_email_unique UNIQUE (email);

-- Add constraint for positive hourly rate
ALTER TABLE public.staff 
ADD CONSTRAINT staff_positive_hourly_rate 
CHECK (hourly_rate >= 0 OR hourly_rate IS NULL);