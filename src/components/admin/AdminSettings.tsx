
import React, { useState } from "react";
import { useCompanySettings } from "@/hooks/company/use-company-settings";
import AdminSettingsHeader from "./settings/AdminSettingsHeader";
import CompanyInfoSettings from "./settings/CompanyInfoSettings";
import BankAccountsManager from "./settings/BankAccountsManager";
import MulticaixaAccountsManager from "./settings/MulticaixaAccountsManager";
import PaymentNotesSettings from "./settings/PaymentNotesSettings";
import SystemSettings from "./settings/SystemSettings";
import InvoiceSettings from "./settings/InvoiceSettings";
import PrinterSettings from "./settings/PrinterSettings";
import AllInvoicesView from "./AllInvoicesView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, CreditCard, FileText, Settings, Printer, Receipt } from "lucide-react";

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

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Faturas</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pagamentos</span>
          </TabsTrigger>
          <TabsTrigger value="printers" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Impressoras</span>
          </TabsTrigger>
          <TabsTrigger value="all-invoices" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            <span className="hidden sm:inline">Todas Faturas</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Sistema</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-6 mt-6">
          <CompanyInfoSettings 
            settings={localSettings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6 mt-6">
          <InvoiceSettings />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MulticaixaAccountsManager />
            <BankAccountsManager />
          </div>
          <PaymentNotesSettings 
            settings={localSettings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>

        <TabsContent value="printers" className="space-y-6 mt-6">
          <PrinterSettings />
        </TabsContent>

        <TabsContent value="all-invoices" className="space-y-6 mt-6">
          <AllInvoicesView />
        </TabsContent>

        <TabsContent value="system" className="space-y-6 mt-6">
          <SystemSettings 
            settings={localSettings}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
