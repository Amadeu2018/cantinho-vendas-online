import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanySettingsForm from '@/components/admin/settings/CompanySettings';
import DeliverySettings from '@/components/admin/settings/DeliverySettings';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import { Building2, Truck, Bell, Settings } from 'lucide-react';

const CompanySettingsPage = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-cantinho-navy mb-2">
            Configurações do Sistema
          </h1>
          <p className="text-gray-600">
            Gerencie as configurações da sua empresa, sistema de entregas e notificações.
          </p>
        </div>
        
        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Entregas
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Avançado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <CompanySettingsForm />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliverySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-cantinho-terracotta" />
                    Sistema de Notificações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Monitore notificações em tempo real do sistema. As notificações são criadas automaticamente 
                    quando novos pedidos são feitos ou quando há atualizações importantes.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">Pedidos</div>
                      <div className="text-blue-600">Notificações de novos pedidos</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-800">Atualizações</div>
                      <div className="text-yellow-600">Mudanças de status</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">Pagamentos</div>
                      <div className="text-green-600">Confirmações de pagamento</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <NotificationCenter />
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Configurações de Sistema</h3>
                    <p className="text-yellow-700 text-sm">
                      As configurações avançadas incluem integração com APIs externas, 
                      configurações de banco de dados e parâmetros de segurança.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Integração em Tempo Real</h3>
                    <p className="text-blue-700 text-sm">
                      O sistema está conectado ao Supabase para sincronização em tempo real de:
                    </p>
                    <ul className="text-blue-700 text-sm mt-2 ml-4 list-disc">
                      <li>Zonas de entrega e taxas</li>
                      <li>Métodos de pagamento</li>
                      <li>Notificações de pedidos</li>
                      <li>Configurações da empresa</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Status do Sistema</h3>
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Sistema conectado e funcionando
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanySettingsPage;