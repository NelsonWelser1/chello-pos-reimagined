
CREATE POLICY "Allow public access to staff table" 
ON public.staff
FOR ALL
USING (true)
WITH CHECK (true);
