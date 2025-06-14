
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Mail, 
  Clock,
  Save,
  RefreshCw
} from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    restaurantName: "Cantinho Algarvio",
    restaurantEmail: "admin@cantinho.ao",
    restaurantPhone: "+244 900 000 000",
    restaurantAddress: "Luanda, Angola",
    workingHours: "08:00 - 22:00",
    deliveryRadius: "15",
    minimumOrderValue: "2000",
    deliveryFee: "500",
    taxRate: "14",
    notifications: {
      newOrders: true,
      lowStock: true,
      dailyReports: false,
      customerReviews: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
      passwordExpiry: "90"
    },
    appearance: {
      theme: "light",
      primaryColor: "#8B4513",
      secondaryColor: "#F4A460"
    }
  });

  const { toast } = useToast();

  const handleSave = () => {
    // Aqui você salvaria as configurações no backend
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso!",
    });
  };

  const handleReset = () => {
    // Reset para configurações padrão
    toast({
      title: "Configurações resetadas",
      description: "As configurações foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cantinho-navy">Configurações do Sistema</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do Restaurante</Label>
              <Input
                id="restaurantName"
                value={settings.restaurantName}
                onChange={(e) => setSettings({...settings, restaurantName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantEmail">Email</Label>
              <Input
                id="restaurantEmail"
                type="email"
                value={settings.restaurantEmail}
                onChange={(e) => setSettings({...settings, restaurantEmail: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantPhone">Telefone</Label>
              <Input
                id="restaurantPhone"
                value={settings.restaurantPhone}
                onChange={(e) => setSettings({...settings, restaurantPhone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="restaurantAddress">Endereço</Label>
              <Textarea
                id="restaurantAddress"
                value={settings.restaurantAddress}
                onChange={(e) => setSettings({...settings, restaurantAddress: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Entrega */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Configurações de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workingHours">Horário de Funcionamento</Label>
              <Input
                id="workingHours"
                value={settings.workingHours}
                onChange={(e) => setSettings({...settings, workingHours: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryRadius">Raio de Entrega (km)</Label>
              <Input
                id="deliveryRadius"
                type="number"
                value={settings.deliveryRadius}
                onChange={(e) => setSettings({...settings, deliveryRadius: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumOrderValue">Valor Mínimo do Pedido (AOA)</Label>
              <Input
                id="minimumOrderValue"
                type="number"
                value={settings.minimumOrderValue}
                onChange={(e) => setSettings({...settings, minimumOrderValue: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryFee">Taxa de Entrega (AOA)</Label>
              <Input
                id="deliveryFee"
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({...settings, deliveryFee: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Taxa de IVA (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="newOrders">Novos Pedidos</Label>
              <Switch
                id="newOrders"
                checked={settings.notifications.newOrders}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, newOrders: checked}
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowStock">Estoque Baixo</Label>
              <Switch
                id="lowStock"
                checked={settings.notifications.lowStock}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, lowStock: checked}
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dailyReports">Relatórios Diários</Label>
              <Switch
                id="dailyReports"
                checked={settings.notifications.dailyReports}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, dailyReports: checked}
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="customerReviews">Avaliações de Clientes</Label>
              <Switch
                id="customerReviews"
                checked={settings.notifications.customerReviews}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    notifications: {...settings.notifications, customerReviews: checked}
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactor">Autenticação de Dois Fatores</Label>
              <Switch
                id="twoFactor"
                checked={settings.security.twoFactor}
                onCheckedChange={(checked) => 
                  setSettings({
                    ...settings, 
                    security: {...settings.security, twoFactor: checked}
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label>
              <Select
                value={settings.security.sessionTimeout}
                onValueChange={(value) => 
                  setSettings({
                    ...settings, 
                    security: {...settings.security, sessionTimeout: value}
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordExpiry">Expiração da Senha (dias)</Label>
              <Select
                value={settings.security.passwordExpiry}
                onValueChange={(value) => 
                  setSettings({
                    ...settings, 
                    security: {...settings.security, passwordExpiry: value}
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 dias</SelectItem>
                  <SelectItem value="60">60 dias</SelectItem>
                  <SelectItem value="90">90 dias</SelectItem>
                  <SelectItem value="never">Nunca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
