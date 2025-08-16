-- Enable RLS on products table (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Enable RLS on categories table (if not already enabled)  
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Add policy for admins to see all products
CREATE POLICY IF NOT EXISTS "Admins can view all products" 
ON public.products FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Add policy for admins to manage all products
CREATE POLICY IF NOT EXISTS "Admins can manage all products" 
ON public.products FOR ALL 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Add policy for admins to view all categories
CREATE POLICY IF NOT EXISTS "Admins can view all categories" 
ON public.categories FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);