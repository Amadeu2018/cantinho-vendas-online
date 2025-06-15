
-- Remover completamente a restrição existente
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;

-- Verificar todos os valores únicos de payment_method na tabela
SELECT DISTINCT payment_method, COUNT(*) as count 
FROM public.orders 
GROUP BY payment_method 
ORDER BY payment_method;

-- Atualizar todos os registros com payment_method NULL ou inválido
UPDATE public.orders 
SET payment_method = CASE 
  WHEN payment_method IS NULL THEN 'Dinheiro na Entrega'
  WHEN payment_method = 'Multicaixa Express' THEN 'Multicaixa Express'
  WHEN payment_method = 'Transferência Bancária' THEN 'Transferência Bancária'
  WHEN payment_method = 'Dinheiro' THEN 'Dinheiro na Entrega'
  ELSE 'Dinheiro na Entrega'
END;

-- Agora criar a nova restrição com os valores corretos baseados no código
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check 
CHECK (payment_method IN (
  'Dinheiro na Entrega', 
  'Multicaixa Express', 
  'Transferência Bancária'
));
