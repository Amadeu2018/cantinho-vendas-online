
import React, { useState } from "react";
import { useCompanySettings } from "@/hooks/company/use-company-settings";
import AdminSettingsHeader from "./settings/AdminSettingsHeader";
import CompanyInfoSettings from "./settings/CompanyInfoSettings";
import BankAccountsManager from "./settings/BankAccountsManager";
import MulticaixaAccountsManager from "./settings/MulticaixaAccountsManager";
import PaymentNotesSettings from "./settings/PaymentNotesSettings";
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
      <AdminSettingsHeader 
        saving={saving} 
        onSave={handleSave} 
      />

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
      <PaymentNotesSettings 
        settings={localSettings}
        onSettingsChange={handleSettingsChange}
      />

      {/* System Settings */}
      <SystemSettings 
        settings={localSettings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default AdminSettings;
