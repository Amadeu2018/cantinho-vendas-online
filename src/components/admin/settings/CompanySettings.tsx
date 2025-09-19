import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCompanySettings, CompanySettings } from "@/hooks/company/use-company-settings";
import { Building2, Globe, Palette, Bell, FileText } from "lucide-react";
import { toast } from "sonner";

const CompanySettingsForm = () => {
  const { settings, loading, saving, updateSettings } = useCompanySettings();
  const [formData, setFormData] = React.useState<CompanySettings>(settings);

  React.useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleInputChange = (field: keyof CompanySettings, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const result = await updateSettings(formData);
    if (result.success) {
      toast.success('Configurações salvas com sucesso!');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Nome da Empresa</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                placeholder="Nome da sua empresa"
              />
            </div>
            <div>
              <Label htmlFor="company_nif">NIF</Label>
              <Input
                id="company_nif"
                value={formData.company_nif}
                onChange={(e) => handleInputChange('company_nif', e.target.value)}
                placeholder="Número de Identificação Fiscal"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_email">Email</Label>
              <Input
                id="company_email"
                type="email"
                value={formData.company_email}
                onChange={(e) => handleInputChange('company_email', e.target.value)}
                placeholder="email@empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="company_phone">Telefone</Label>
              <Input
                id="company_phone"
                value={formData.company_phone}
                onChange={(e) => handleInputChange('company_phone', e.target.value)}
                placeholder="+244 900 000 000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="company_address">Endereço</Label>
            <Textarea
              id="company_address"
              value={formData.company_address}
              onChange={(e) => handleInputChange('company_address', e.target.value)}
              placeholder="Endereço completo da empresa"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Configurações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currency">Moeda</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AOA">Kwanza (AOA)</SelectItem>
                  <SelectItem value="USD">Dólar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => handleInputChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar fuso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Luanda">Luanda (WAT)</SelectItem>
                  <SelectItem value="Europe/Lisbon">Lisboa (WET)</SelectItem>
                  <SelectItem value="America/New_York">Nova York (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="system_language">Idioma</Label>
              <Select
                value={formData.system_language}
                onValueChange={(value) => handleInputChange('system_language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="system_theme">Tema do Sistema</Label>
            <Select
              value={formData.system_theme}
              onValueChange={(value) => handleInputChange('system_theme', value)}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Selecionar tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="auto">Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email_notifications">Notificações por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações importantes por email
              </p>
            </div>
            <Switch
              id="email_notifications"
              checked={formData.email_notifications}
              onCheckedChange={(checked) => handleInputChange('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms_notifications">Notificações por SMS</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações urgentes por SMS
              </p>
            </div>
            <Switch
              id="sms_notifications"
              checked={formData.sms_notifications}
              onCheckedChange={(checked) => handleInputChange('sms_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notas de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="payment_notes">Instruções de Pagamento</Label>
            <Textarea
              id="payment_notes"
              value={formData.payment_notes}
              onChange={(e) => handleInputChange('payment_notes', e.target.value)}
              placeholder="Instruções adicionais sobre pagamentos..."
              rows={4}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Estas notas aparecerão nos detalhes de pagamento dos pedidos
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
        >
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default CompanySettingsForm;