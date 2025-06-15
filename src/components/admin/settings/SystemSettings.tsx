
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, Palette, Globe, DollarSign, Clock, Bell, MessageSquare } from "lucide-react";
import { CompanySettings } from "@/hooks/company/use-company-settings";

interface SystemSettingsProps {
  settings: CompanySettings;
  onSettingsChange: (settings: Partial<CompanySettings>) => void;
}

const SystemSettings = ({ settings, onSettingsChange }: SystemSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Tema do Sistema
            </label>
            <Select
              value={settings.system_theme || "light"}
              onValueChange={(value) => onSettingsChange({ system_theme: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Escuro</SelectItem>
                <SelectItem value="auto">Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Idioma
            </label>
            <Select
              value={settings.system_language || "pt"}
              onValueChange={(value) => onSettingsChange({ system_language: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Moeda
            </label>
            <Select
              value={settings.currency || "AOA"}
              onValueChange={(value) => onSettingsChange({ currency: value })}
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
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Fuso Horário
            </label>
            <Select
              value={settings.timezone || "Africa/Luanda"}
              onValueChange={(value) => onSettingsChange({ timezone: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar fuso horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Luanda">Luanda (GMT+1)</SelectItem>
                <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                <SelectItem value="Europe/Lisbon">Lisboa (GMT+0/+1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </h4>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Notificações por Email</label>
              <p className="text-xs text-gray-500">Receber notificações de pedidos por email</p>
            </div>
            <Switch
              checked={settings.email_notifications || false}
              onCheckedChange={(checked) => onSettingsChange({ email_notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Notificações por SMS
              </label>
              <p className="text-xs text-gray-500">Receber notificações de pedidos por SMS</p>
            </div>
            <Switch
              checked={settings.sms_notifications || false}
              onCheckedChange={(checked) => onSettingsChange({ sms_notifications: checked })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;
