
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Settings2, QrCode, Building2, CreditCard, Eye } from "lucide-react";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import EnhancedPrimaveraTemplate from "../invoice/EnhancedPrimaveraTemplate";

const InvoiceSettings = () => {
  const { settings, templates, loading, updateSettings } = useInvoiceSettings();
  const [showPreview, setShowPreview] = useState(false);

  // Sample data for preview
  const sampleInvoiceData = {
    number: "FT-2024-001",
    date: new Date().toISOString(),
    type: 'invoice' as const,
    customer: {
      name: "João Silva",
      email: "joao@email.com",
      phone: "+244 900 000 000",
      address: "Rua da Liberdade, Luanda",
      nif: "123456789"
    },
    items: [{
      description: "Muamba de Galinha com Funge",
      quantity: 2,
      unit_price: 2500,
      tax_rate: 14,
      total: 5000
    }],
    subtotal: 4385.96,
    tax_total: 614.04,
    total: 5000,
    payment_method: "Transferência Bancária",
    notes: "Entrega prevista para amanhã às 12h00"
  };

  if (loading) {
    return <div>Carregando configurações de fatura...</div>;
  }

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pré-visualização da Fatura</h3>
          <Button onClick={() => setShowPreview(false)} variant="outline">
            Voltar às Configurações
          </Button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <EnhancedPrimaveraTemplate data={sampleInvoiceData} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Modelo de Fatura
            </CardTitle>
            <Button onClick={() => setShowPreview(true)} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Pré-visualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="invoice_template">Escolher Modelo</Label>
            <Select
              value={settings.invoice_template}
              onValueChange={(value) => updateSettings({ invoice_template: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">{template.description}</div>
                      </div>
                      {template.id === 'primavera' && (
                        <Badge variant="secondary">Recomendado</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Elementos da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_logo">Mostrar Logótipo</Label>
                  <Switch
                    id="show_logo"
                    checked={settings.show_company_logo}
                    onCheckedChange={(checked) => updateSettings({ show_company_logo: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_bank">Dados Bancários</Label>
                  <Switch
                    id="show_bank"
                    checked={settings.show_bank_details}
                    onCheckedChange={(checked) => updateSettings({ show_bank_details: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Elementos Fiscais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_qr">Código QR</Label>
                  <Switch
                    id="show_qr"
                    checked={settings.show_qr_code}
                    onCheckedChange={(checked) => updateSettings({ show_qr_code: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show_tax">Detalhes Fiscais</Label>
                  <Switch
                    id="show_tax"
                    checked={settings.show_tax_details}
                    onCheckedChange={(checked) => updateSettings({ show_tax_details: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Numbering Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Numeração Automática
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label htmlFor="auto_generate">Gerar Números Automaticamente</Label>
              <p className="text-sm text-gray-500 mt-1">
                Numera automaticamente suas faturas e proformas
              </p>
            </div>
            <Switch
              id="auto_generate"
              checked={settings.auto_generate_numbers}
              onCheckedChange={(checked) => updateSettings({ auto_generate_numbers: checked })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_prefix">Prefixo Fatura</Label>
              <Input
                id="invoice_prefix"
                value={settings.invoice_number_prefix}
                onChange={(e) => updateSettings({ invoice_number_prefix: e.target.value })}
                placeholder="FT"
              />
              <p className="text-xs text-gray-500 mt-1">Ex: FT-2024-001</p>
            </div>

            <div>
              <Label htmlFor="proforma_prefix">Prefixo Proforma</Label>
              <Input
                id="proforma_prefix"
                value={settings.proforma_number_prefix}
                onChange={(e) => updateSettings({ proforma_number_prefix: e.target.value })}
                placeholder="PRO"
              />
              <p className="text-xs text-gray-500 mt-1">Ex: PRO-2024-001</p>
            </div>
          </div>

          <div>
            <Label htmlFor="default_currency">Moeda Padrão</Label>
            <Select
              value={settings.default_currency}
              onValueChange={(value) => updateSettings({ default_currency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AOA">Kwanza Angolano (AOA)</SelectItem>
                <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Custom Text Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Textos Personalizados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="footer_text">Texto do Rodapé</Label>
            <Textarea
              id="footer_text"
              value={settings.invoice_footer_text || ""}
              onChange={(e) => updateSettings({ invoice_footer_text: e.target.value })}
              placeholder="Obrigado pela sua preferência!"
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-1">
              Aparece no final da fatura como mensagem de agradecimento
            </p>
          </div>

          <div>
            <Label htmlFor="terms">Termos e Condições</Label>
            <Textarea
              id="terms"
              value={settings.invoice_terms || ""}
              onChange={(e) => updateSettings({ invoice_terms: e.target.value })}
              placeholder="Pagamento a pronto. Mercadoria viaja por conta e risco do comprador..."
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Condições gerais aplicáveis às transações
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Configurações de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Informações Bancárias</h4>
            <p className="text-sm text-blue-700">
              Configure suas contas bancárias na seção "Pagamentos" para que apareçam automaticamente nas faturas.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Multicaixa Express</h4>
            <p className="text-sm text-green-700">
              Configure suas contas Multicaixa na seção "Pagamentos" para facilitar os pagamentos móveis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSettings;
