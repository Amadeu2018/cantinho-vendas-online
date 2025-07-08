-- Adicionar categorias específicas de churrascaria
INSERT INTO public.categories (name, description) VALUES 
('Carnes Bovinas', 'Picanha, maminha, fraldinha, costela e outras carnes bovinas grelhadas'),
('Carnes Suínas', 'Lombo, costela suína, linguiça e outras carnes suínas grelhadas'),
('Carnes de Frango', 'Coxa, sobrecoxa, peito, espetadas de frango'),
('Carnes de Peixe', 'Salmão, robalo, dourada e outros peixes grelhados'),
('Acompanhamentos Grill', 'Farofa, vinagrete, pão de alho, saladas para churrasco'),
('Bebidas Grill', 'Refrigerantes, cervejas, sucos para acompanhar churrasco'),
('Combos Churrascaria', 'Combos família e rodízio delivery'),
('Espetadas', 'Espetadas variadas de carnes e legumes')
ON CONFLICT (name) DO NOTHING;

-- Adicionar campos específicos para produtos de churrascaria
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sale_unit TEXT DEFAULT 'unit',
ADD COLUMN IF NOT EXISTS prep_time_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS meat_options JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS spice_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_grill_product BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS combo_serves INTEGER DEFAULT 1;

-- Criar tabela para personalização de pedidos de churrascaria
CREATE TABLE IF NOT EXISTS public.grill_customizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  meat_doneness TEXT[] DEFAULT ARRAY['mal passada', 'ao ponto', 'bem passada'],
  available_marinades TEXT[] DEFAULT ARRAY['tradicional', 'alho e ervas', 'pimenta', 'limão'],
  side_dishes TEXT[] DEFAULT ARRAY['farofa', 'vinagrete', 'pão de alho'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expandir tabela de promoções
ALTER TABLE public.promotions 
ADD COLUMN IF NOT EXISTS promotion_type TEXT DEFAULT 'percentage',
ADD COLUMN IF NOT EXISTS min_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS combo_products JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS applies_to_category_id UUID REFERENCES public.categories(id);

-- Enable RLS
ALTER TABLE public.grill_customizations ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes e recriar
DROP POLICY IF EXISTS "Customizações são visíveis publicamente" ON public.grill_customizations;
DROP POLICY IF EXISTS "Vendedores podem gerenciar customizações de seus produtos" ON public.grill_customizations;

-- Criar políticas para grill_customizations
CREATE POLICY "Customizações são visíveis publicamente" 
ON public.grill_customizations 
FOR SELECT 
USING (true);

CREATE POLICY "Vendedores podem gerenciar customizações de seus produtos" 
ON public.grill_customizations 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM products 
  WHERE products.id = grill_customizations.product_id 
  AND products.seller_id = auth.uid()
));

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_grill_customizations_updated_at ON public.grill_customizations;

CREATE TRIGGER update_grill_customizations_updated_at
  BEFORE UPDATE ON public.grill_customizations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Inserir produtos exemplo de churrascaria
INSERT INTO public.products (
  name, description, price, category_id, sale_unit, prep_time_minutes, 
  is_grill_product, spice_level, meat_options, combo_serves
) 
SELECT 
  'Picanha Premium',
  'Picanha bovina de primeira qualidade, grelhada no ponto desejado',
  8500,
  c.id,
  'kg',
  50,
  true,
  2,
  '["mal passada", "ao ponto", "bem passada"]'::jsonb,
  1
FROM public.categories c WHERE c.name = 'Carnes Bovinas'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Picanha Premium');

INSERT INTO public.products (
  name, description, price, category_id, sale_unit, prep_time_minutes, 
  is_grill_product, spice_level, combo_serves
) 
SELECT 
  'Combo Família 4 Pessoas',
  'Picanha, frango, linguiça, acompanhamentos completos para 4 pessoas',
  15000,
  c.id,
  'combo',
  60,
  true,
  1,
  4
FROM public.categories c WHERE c.name = 'Combos Churrascaria'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Combo Família 4 Pessoas');

INSERT INTO public.products (
  name, description, price, category_id, sale_unit, prep_time_minutes, 
  is_grill_product, spice_level
) 
SELECT 
  'Rodízio Delivery Individual',
  'Variedade de carnes grelhadas entregues em porções individuais',
  4500,
  c.id,
  'rodizio',
  45,
  true,
  2
FROM public.categories c WHERE c.name = 'Combos Churrascaria'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Rodízio Delivery Individual');