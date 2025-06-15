
-- Adicionar colunas para configurações de pagamento da empresa na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS multicaixa_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS multicaixa_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_account_iban TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_account_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bank_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Adicionar colunas para informações da empresa
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_nif TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_logo_url TEXT;
