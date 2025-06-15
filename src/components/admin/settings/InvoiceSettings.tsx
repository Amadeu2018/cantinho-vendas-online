
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Printer, Settings2, QrCode } from "lucide-react";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";

const InvoiceSettings = () => {
  const { settings, printers, templates, loading, updateSettings } = useInvoiceSettings();

  if (loading) {
    return <div>Carregando configurações de fatura...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Modelo de Fatura
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show_logo">Mostrar Logótipo</Label>
              <Switch
                id="show_logo"
                checked={settings.show_company_logo}
                onCheckedChange={(checked) => updateSettings({ show_company_logo: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show_qr">Código QR</Label>
              <Switch
                id="show_qr"
                checked={settings.show_qr_code}
                onCheckedChange={(checked) => updateSettings({ show_qr_code: checked })}
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

            <div className="flex items-center justify-between">
              <Label htmlFor="show_tax">Detalhes Fiscais</Label>
              <Switch
                id="show_tax"
                checked={settings.show_tax_details}
                onCheckedChange={(checked) => updateSettings({ show_tax_details: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numbering Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Numeração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Label htmlFor="auto_generate">Gerar Números Automaticamente</Label>
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
            </div>

            <div>
              <Label htmlFor="proforma_prefix">Prefixo Proforma</Label>
              <Input
                id="proforma_prefix"
                value={settings.proforma_number_prefix}
                onChange={(e) => updateSettings({ proforma_number_prefix: e.target.value })}
                placeholder="PRO"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Settings */}
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
          </div>

          <div>
            <Label htmlFor="terms">Termos e Condições</Label>
            <Textarea
              id="terms"
              value={settings.invoice_terms || ""}
              onChange={(e) => updateSettings({ invoice_terms: e.target.value })}
              placeholder="Pagamento a pronto. Mercadoria viajam por conta e risco do comprador..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Printer Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Configurações de Impressora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Impressoras Configuradas</Label>
            <div className="space-y-2 mt-2">
              {printers.map((printer) => (
                <div key={printer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{printer.name}</div>
                    <div className="text-sm text-gray-500">
                      {printer.type} • {printer.paper_size}
                      {printer.is_default && <span className="ml-2 text-green-600">(Padrão)</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <Printer className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSettings;
