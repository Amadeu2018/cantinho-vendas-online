
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CompanySettings {
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  company_nif?: string;
  company_logo_url?: string;
  multicaixa_phone?: string;
  multicaixa_name?: string;
  bank_account_iban?: string;
  bank_account_name?: string;
  bank_name?: string;
  payment_notes?: string;
}

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanySettings();
  }, []);

  const fetchCompanySettings = async () => {
    try {
      // Buscar configurações de qualquer admin
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          company_name, company_email, company_phone, company_address, 
          company_nif, company_logo_url, multicaixa_phone, multicaixa_name, 
          bank_account_iban, bank_account_name, bank_name, payment_notes
        `)
        .eq("role", "admin")
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Erro ao buscar configurações da empresa:", error);
        return;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações da empresa:", error);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refreshSettings: fetchCompanySettings };
};
