
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Building2, Phone, Save } from "lucide-react";

interface PaymentSettingsData {
  multicaixa_phone?: string;
  multicaixa_name?: string;
  bank_account_iban?: string;
  bank_account_name?: string;
  bank_name?: string;
  payment_notes?: string;
}

const PaymentSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<PaymentSettingsData>({});

  useEffect(() => {
    if (user) {
      fetchPaymentSettings();
    }
  }, [user]);

  const fetchPaymentSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("multicaixa_phone, multicaixa_name, bank_account_iban, bank_account_name, bank_name, payment_notes")
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
        description: "Suas informações de pagamento foram atualizadas.",
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Multicaixa Express
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Conta Bancária
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
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Titular
            </label>
            <Input
              type="text"
              placeholder="Nome completo"
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Notas Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Instruções especiais para pagamentos..."
            value={settings.payment_notes || ""}
            onChange={(e) => setSettings({ ...settings, payment_notes: e.target.value })}
            rows={3}
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

export default PaymentSettings;
