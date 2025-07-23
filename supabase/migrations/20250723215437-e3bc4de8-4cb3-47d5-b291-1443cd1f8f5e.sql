-- Create function to increment pickup point order count
CREATE OR REPLACE FUNCTION public.increment_pickup_point_orders(
  point_id UUID,
  increment_by INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.pickup_points 
  SET current_orders = GREATEST(0, current_orders + increment_by),
      updated_at = now()
  WHERE id = point_id;
END;
$$ LANGUAGE plpgsql;