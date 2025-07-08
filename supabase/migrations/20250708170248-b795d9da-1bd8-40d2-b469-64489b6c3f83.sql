-- Add new categories for grill/barbecue products
INSERT INTO public.categories (name, description) VALUES 
('Churrascaria', 'Produtos frescos da churrascaria para entrega'),
('Carnes Grelhadas', 'Carnes grelhadas prontas para entrega'),
('Produtos do Grill', 'Diversos produtos do grill e churrasco'),
('Espetadas', 'Espetadas e grelhados especiais'),
('Acompanhamentos Grill', 'Acompanhamentos para carnes grelhadas')
ON CONFLICT (name) DO NOTHING;