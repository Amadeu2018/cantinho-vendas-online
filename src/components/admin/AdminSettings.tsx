
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, CreditCard } from "lucide-react";
import { useCompanySettings } from "@/hooks/company/use-company-settings";
import CompanyInfoSettings from "./settings/CompanyInfoSettings";
import BankAccountsManager from "./settings/BankAccountsManager";
import MulticaixaAccountsManager from "./settings/MulticaixaAccountsManager";
import SystemSettings from "./settings/SystemSettings";

const AdminSettings = () => {
  const { settings, loading, saving, updateSettings } = useCompanySettings();
  const [localSettings, setLocalSettings] = useState(settings);

  // Update local settings when settings change
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
    setLocalSettings({ ...localSettings, ...newSettings });
  };

  const handleSave = async () => {
    await updateSettings(localSettings);
  };

  if (loading) {
    return <div>Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cantinho-navy">Configurações da Empresa</h2>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>

      {/* Company Information */}
      <CompanyInfoSettings 
        settings={localSettings}
        onSettingsChange={handleSettingsChange}
      />

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MulticaixaAccountsManager />
        <BankAccountsManager />
      </div>

      {/* Payment Notes */}
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
            value={localSettings.payment_notes || ""}
            onChange={(e) => handleSettingsChange({ payment_notes: e.target.value })}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* System Settings */}
      <SystemSettings 
        settings={localSettings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default AdminSettings;
