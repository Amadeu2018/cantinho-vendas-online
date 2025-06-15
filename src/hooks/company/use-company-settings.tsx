
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface CompanySettings {
  id?: string;
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  company_address?: string;
  company_nif?: string;
  company_logo_url?: string;
  payment_notes?: string;
  system_theme?: string;
  system_language?: string;
  currency?: string;
  timezone?: string;
  email_notifications?: boolean;
  sms_notifications?: boolean;
}

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("company_settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("company_settings")
        .upsert({
          ...settings,
          ...newSettings,
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, saving, updateSettings, refreshSettings: fetchSettings };
};
