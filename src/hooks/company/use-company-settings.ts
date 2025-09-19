import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CompanySettings {
  id?: string;
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  company_nif: string;
  currency: string;
  timezone: string;
  system_language: string;
  system_theme: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  payment_notes: string;
  company_logo_url?: string;
}

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_nif: '',
    currency: 'AOA',
    timezone: 'Africa/Luanda',
    system_language: 'pt',
    system_theme: 'light',
    email_notifications: true,
    sms_notifications: false,
    payment_notes: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        setSettings({
          id: data.id,
          company_name: data.company_name || '',
          company_email: data.company_email || '',
          company_phone: data.company_phone || '',
          company_address: data.company_address || '',
          company_nif: data.company_nif || '',
          currency: data.currency || 'AOA',
          timezone: data.timezone || 'Africa/Luanda',
          system_language: data.system_language || 'pt',
          system_theme: data.system_theme || 'light',
          email_notifications: data.email_notifications ?? true,
          sms_notifications: data.sms_notifications ?? false,
          payment_notes: data.payment_notes || '',
          company_logo_url: data.company_logo_url || undefined
        });
      }
    } catch (err) {
      console.error('Error fetching company settings:', err);
      setError(err instanceof Error ? err.message : 'Error fetching settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    try {
      setSaving(true);
      setError(null);
      
      const settingsToUpdate = {
        company_name: newSettings.company_name,
        company_email: newSettings.company_email,
        company_phone: newSettings.company_phone,
        company_address: newSettings.company_address,
        company_nif: newSettings.company_nif,
        currency: newSettings.currency,
        timezone: newSettings.timezone,
        system_language: newSettings.system_language,
        system_theme: newSettings.system_theme,
        email_notifications: newSettings.email_notifications,
        sms_notifications: newSettings.sms_notifications,
        payment_notes: newSettings.payment_notes,
        company_logo_url: newSettings.company_logo_url,
        updated_at: new Date().toISOString()
      };

      let result;
      if (settings.id) {
        // Update existing settings
        result = await supabase
          .from('company_settings')
          .update(settingsToUpdate)
          .eq('id', settings.id)
          .select()
          .single();
      } else {
        // Insert new settings
        result = await supabase
          .from('company_settings')
          .insert([settingsToUpdate])
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      if (result.data) {
        setSettings(prev => ({ ...prev, ...newSettings, id: result.data.id }));
        toast.success('Configurações atualizadas com sucesso!');
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error updating company settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error updating settings';
      setError(errorMessage);
      toast.error(`Erro ao atualizar configurações: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    error,
    updateSettings,
    refetch: fetchSettings
  };
};