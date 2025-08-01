import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  type: 'modern' | 'classic' | 'minimal' | 'primavera';
}

export interface PrinterConfig {
  id: string;
  name: string;
  type: 'thermal' | 'laser' | 'inkjet';
  paper_size: 'A4' | 'A5' | 'thermal_80mm' | 'thermal_58mm';
  is_default: boolean;
}

export interface InvoiceSettings {
  id?: string;
  invoice_template: string;
  show_company_logo: boolean;
  show_qr_code: boolean;
  show_bank_details: boolean;
  show_tax_details: boolean;
  default_currency: string;
  invoice_footer_text?: string;
  invoice_terms?: string;
  auto_generate_numbers: boolean;
  invoice_number_prefix: string;
  proforma_number_prefix: string;
  created_at?: string;
  updated_at?: string;
}

export const defaultInvoiceTemplates: InvoiceTemplate[] = [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Design limpo e moderno com cores vibrantes',
    type: 'modern'
  },
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Design tradicional e profissional',
    type: 'classic'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Design simples e elegante',
    type: 'minimal'
  },
  {
    id: 'primavera',
    name: 'Primavera Style',
    description: 'Similar ao formato do software Primavera',
    type: 'primavera'
  }
];

export const defaultPrinterConfigs: PrinterConfig[] = [
  {
    id: 'default_laser',
    name: 'Impressora Laser Padrão',
    type: 'laser',
    paper_size: 'A4',
    is_default: true
  },
  {
    id: 'thermal_80',
    name: 'Impressora Térmica 80mm',
    type: 'thermal',
    paper_size: 'thermal_80mm',
    is_default: false
  },
  {
    id: 'thermal_58',
    name: 'Impressora Térmica 58mm',
    type: 'thermal',
    paper_size: 'thermal_58mm',
    is_default: false
  }
];

export const useInvoiceSettings = () => {
  const [settings, setSettings] = useState<InvoiceSettings>({
    invoice_template: 'primavera',
    show_company_logo: true,
    show_qr_code: false,
    show_bank_details: true,
    show_tax_details: true,
    default_currency: 'AOA',
    auto_generate_numbers: true,
    invoice_number_prefix: 'FT',
    proforma_number_prefix: 'PRO'
  });
  const [printers, setPrinters] = useState<PrinterConfig[]>(defaultPrinterConfigs);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // NOTE: Database fetching is temporarily disabled to fix build errors.
  // A migration is needed to create the 'invoice_settings' table.
  // useEffect(() => {
  //   fetchSettings();
  // }, []);

  const fetchSettings = async () => {
    console.warn("Database fetching for invoice settings is disabled.");
  };

  const updateSettings = async (newSettings: Partial<InvoiceSettings>) => {
    setSaving(true);
    try {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      toast({
        title: "Configurações de fatura salvas (temporariamente)",
        description: "As suas alterações foram guardadas nesta sessão.",
      });
    } catch (error: any) {
      console.error("Erro ao salvar configurações de fatura:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return { 
    settings, 
    printers, 
    loading, 
    saving, 
    updateSettings, 
    refreshSettings: fetchSettings,
    templates: defaultInvoiceTemplates
  };
};
