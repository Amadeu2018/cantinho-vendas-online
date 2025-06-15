
-- Create company_settings table for centralized company configuration
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT,
  company_email TEXT,
  company_phone TEXT,
  company_address TEXT,
  company_nif TEXT,
  company_logo_url TEXT,
  payment_notes TEXT,
  system_theme TEXT DEFAULT 'light',
  system_language TEXT DEFAULT 'pt',
  currency TEXT DEFAULT 'AOA',
  timezone TEXT DEFAULT 'Africa/Luanda',
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank_accounts table for multiple bank coordinates
CREATE TABLE public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_iban TEXT NOT NULL,
  swift_code TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create multicaixa_accounts table for multiple Multicaixa coordinates
CREATE TABLE public.multicaixa_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default company settings
INSERT INTO public.company_settings (id) VALUES (gen_random_uuid());

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER multicaixa_accounts_updated_at
  BEFORE UPDATE ON public.multicaixa_accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add RLS policies
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.multicaixa_accounts ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage company settings
CREATE POLICY "Admins can manage company settings" ON public.company_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage bank accounts" ON public.bank_accounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage multicaixa accounts" ON public.multicaixa_accounts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow everyone to read company settings for receipts/invoices
CREATE POLICY "Everyone can read company settings" ON public.company_settings
  FOR SELECT USING (true);

CREATE POLICY "Everyone can read active bank accounts" ON public.bank_accounts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Everyone can read active multicaixa accounts" ON public.multicaixa_accounts
  FOR SELECT USING (is_active = true);
