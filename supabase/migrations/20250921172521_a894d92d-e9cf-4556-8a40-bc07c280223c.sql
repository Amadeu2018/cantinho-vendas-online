-- Check if there are issues with RLS policies for delivery_zones
-- The current policies should allow public read access, but let's ensure they're working

-- Drop and recreate the policies to ensure they work correctly
DROP POLICY IF EXISTS "Delivery zones are viewable by everyone" ON delivery_zones;
DROP POLICY IF EXISTS "Admins can manage delivery zones" ON delivery_zones;

-- Recreate the policies with correct logic
CREATE POLICY "Public can view active delivery zones"
ON delivery_zones
FOR SELECT
USING (is_active = true);

-- Admin policy for full management
CREATE POLICY "Admins can manage delivery zones"
ON delivery_zones
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Ensure RLS is enabled
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;