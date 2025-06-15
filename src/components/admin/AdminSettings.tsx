
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Building2, Phone, Save, Building, Mail, MapPin, Hash, Image } from "lucide-react";

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

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<CompanySettings>({});

  useEffect(() => {
    if (user) {
      fetchCompanySettings();
    }
  }, [user]);

  const fetchCompanySettings = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          company_name, company_email, company_phone, company_address, 
          company_nif, company_logo_url, multicaixa_phone, multicaixa_name, 
          bank_account_iban, bank_account_name, bank_name, payment_notes
        `)
        .eq("id", user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...settings,
        });

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "As configurações da empresa foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao salvar configurações:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cantinho-navy">Configurações da Empresa</h2>
      </div>

      {/* Informações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome da Empresa
              </label>
              <Input
                type="text"
                placeholder="Cantinho Angolano"
                value={settings.company_name || ""}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                NIF da Empresa
              </label>
              <Input
                type="text"
                placeholder="123456789"
                value={settings.company_nif || ""}
                onChange={(e) => setSettings({ ...settings, company_nif: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                <Mail className="h-4 w-4 inline mr-1" />
                Email da Empresa
              </label>
              <Input
                type="email"
                placeholder="contato@cantinhoangolano.com"
                value={settings.company_email || ""}
                onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Phone className="h-4 w-4 inline mr-1" />
                Telefone da Empresa
              </label>
              <Input
                type="tel"
                placeholder="+244 xxx xxx xxx"
                value={settings.company_phone || ""}
                onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <MapPin className="h-4 w-4 inline mr-1" />
              Endereço da Empresa
            </label>
            <Textarea
              placeholder="Rua Principal, Luanda, Angola"
              value={settings.company_address || ""}
              onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              <Image className="h-4 w-4 inline mr-1" />
              URL do Logo
            </label>
            <Input
              type="url"
              placeholder="https://exemplo.com/logo.png"
              value={settings.company_logo_url || ""}
              onChange={(e) => setSettings({ ...settings, company_logo_url: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Multicaixa Express */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Multicaixa Express
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de Telefone
              </label>
              <Input
                type="tel"
                placeholder="9XX XXX XXX"
                value={settings.multicaixa_phone || ""}
                onChange={(e) => setSettings({ ...settings, multicaixa_phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome do Titular
              </label>
              <Input
                type="text"
                placeholder="Nome completo"
                value={settings.multicaixa_name || ""}
                onChange={(e) => setSettings({ ...settings, multicaixa_name: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conta Bancária */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Conta Bancária da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              IBAN
            </label>
            <Input
              type="text"
              placeholder="AO06.0000.0000.0000.0000.0000.0"
              value={settings.bank_account_iban || ""}
              onChange={(e) => setSettings({ ...settings, bank_account_iban: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nome do Titular
              </label>
              <Input
                type="text"
                placeholder="Nome da empresa"
                value={settings.bank_account_name || ""}
                onChange={(e) => setSettings({ ...settings, bank_account_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Banco
              </label>
              <Input
                type="text"
                placeholder="Nome do banco"
                value={settings.bank_name || ""}
                onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notas de Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Instruções de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Instruções especiais para pagamentos, prazos, etc..."
            value={settings.payment_notes || ""}
            onChange={(e) => setSettings({ ...settings, payment_notes: e.target.value })}
            rows={4}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto">
        <Save className="h-4 w-4 mr-2" />
        {loading ? "Salvando..." : "Salvar Configurações"}
      </Button>
    </div>
  );
};

export default AdminSettings;
