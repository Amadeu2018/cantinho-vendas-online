-- Create delivery zones table
CREATE TABLE public.delivery_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  fee NUMERIC NOT NULL DEFAULT 0,
  estimated_time TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_distance NUMERIC,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Delivery zones are viewable by everyone" 
ON public.delivery_zones 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage delivery zones" 
ON public.delivery_zones 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Create trigger for updated_at
CREATE TRIGGER update_delivery_zones_updated_at
BEFORE UPDATE ON public.delivery_zones
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert some default delivery zones
INSERT INTO public.delivery_zones (name, fee, estimated_time, is_active) VALUES
('Bairro Azul', 1000, '20-30 min', true),
('Maculusso', 1500, '25-35 min', true),
('Maianga', 1500, '25-35 min', true),
('Talatona', 2500, '35-50 min', true),
('Miramar', 1800, '30-40 min', true),
('Kilamba', 3000, '40-60 min', true);