
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCompanySettings } from "@/hooks/company/use-company-settings";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";
import { useBankAccounts } from "@/hooks/company/use-bank-accounts";
import { QrCode } from "lucide-react";

interface EnhancedPrimaveraTemplateProps {
  data: {
    number: string;
    date: string;
    type: 'invoice' | 'proforma';
    customer: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      nif?: string;
    };
    items: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      tax_rate?: number;
      total: number;
    }>;
    subtotal: number;
    tax_total: number;
    total: number;
    payment_method?: string;
    payment_reference?: string;
    notes?: string;
  };
}

const EnhancedPrimaveraTemplate = ({ data }: EnhancedPrimaveraTemplateProps) => {
  const { settings: companySettings } = useCompanySettings();
  const { settings: invoiceSettings } = useInvoiceSettings();
  const { accounts: bankAccounts } = useBankAccounts();

  const primaryBank = bankAccounts.find(acc => acc.is_primary && acc.is_active) || bankAccounts[0];
  
  // Generate QR Code data (simplified for demo)
  const qrCodeData = JSON.stringify({
    invoice: data.number,
    amount: data.total,
    date: data.date,
    nif: companySettings.company_nif
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: invoiceSettings.default_currency || 'AOA'
    }).format(amount);
  };

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="border-b-4 border-blue-600 pb-6 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {invoiceSettings.show_company_logo && companySettings.company_logo_url && (
              <div className="mb-4">
                <img 
                  src={companySettings.company_logo_url} 
                  alt="Logo da Empresa" 
                  className="h-20 max-w-48 object-contain"
                />
              </div>
            )}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">
                {companySettings.company_name || 'Cantinho Angolano'}
              </h1>
              <div className="text-gray-700 space-y-1">
                {companySettings.company_address && (
                  <p className="flex items-center">
                    <span className="font-medium mr-2">Endereço:</span>
                    {companySettings.company_address}
                  </p>
                )}
                <div className="flex flex-wrap gap-6">
                  {companySettings.company_phone && (
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Tel:</span>
                      {companySettings.company_phone}
                    </p>
                  )}
                  {companySettings.company_email && (
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Email:</span>
                      {companySettings.company_email}
                    </p>
                  )}
                </div>
                {invoiceSettings.show_tax_details && companySettings.company_nif && (
                  <p className="flex items-center">
                    <span className="font-medium mr-2">NIF:</span>
                    {companySettings.company_nif}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right space-y-4">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-lg">
              <h2 className="text-xl font-bold">
                {data.type === 'proforma' ? 'FATURA PROFORMA' : 'FATURA'}
              </h2>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Número:</span>
                <span className="font-mono">{data.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Data:</span>
                <span>{format(new Date(data.date), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Hora:</span>
                <span>{format(new Date(data.date), "HH:mm", { locale: ptBR })}</span>
              </div>
              {data.payment_reference && (
                <div className="flex justify-between">
                  <span className="font-semibold">Referência:</span>
                  <span className="font-mono">{data.payment_reference}</span>
                </div>
              )}
            </div>
            
            {invoiceSettings.show_qr_code && (
              <div className="bg-white border-2 border-gray-200 p-4 rounded-lg">
                <div className="flex flex-col items-center">
                  <QrCode className="h-16 w-16 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-500">Código QR</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-lg border">
          <h3 className="font-bold text-blue-900 mb-4 text-lg flex items-center">
            <span className="bg-blue-600 text-white p-2 rounded-full mr-3 text-sm">🏢</span>
            DADOS DO CLIENTE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex">
                <span className="font-semibold text-gray-700 w-20">Nome:</span>
                <span className="text-gray-900 font-medium">{data.customer.name}</span>
              </div>
              {data.customer.email && (
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">Email:</span>
                  <span className="text-gray-900">{data.customer.email}</span>
                </div>
              )}
              {data.customer.phone && (
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">Telefone:</span>
                  <span className="text-gray-900">{data.customer.phone}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {data.customer.address && (
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">Endereço:</span>
                  <span className="text-gray-900">{data.customer.address}</span>
                </div>
              )}
              {data.customer.nif && invoiceSettings.show_tax_details && (
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">NIF:</span>
                  <span className="text-gray-900 font-mono">{data.customer.nif}</span>
                </div>
              )}
              {data.payment_method && (
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-20">Pagamento:</span>
                  <span className="text-gray-900">{data.payment_method}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <h3 className="font-bold text-blue-900 mb-4 text-lg">ITENS DA FATURA</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 p-4 text-left font-semibold">DESCRIÇÃO</th>
                <th className="border border-gray-300 p-4 text-center font-semibold w-20">QTD</th>
                <th className="border border-gray-300 p-4 text-right font-semibold w-32">PREÇO UNIT.</th>
                {invoiceSettings.show_tax_details && (
                  <th className="border border-gray-300 p-4 text-center font-semibold w-20">IVA %</th>
                )}
                <th className="border border-gray-300 p-4 text-right font-semibold w-32">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border border-gray-300 p-4">
                    <div className="font-medium">{item.description}</div>
                  </td>
                  <td className="border border-gray-300 p-4 text-center font-semibold">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 p-4 text-right font-mono">
                    {formatCurrency(item.unit_price)}
                  </td>
                  {invoiceSettings.show_tax_details && (
                    <td className="border border-gray-300 p-4 text-center">
                      {item.tax_rate || 14}%
                    </td>
                  )}
                  <td className="border border-gray-300 p-4 text-right font-bold font-mono">
                    {formatCurrency(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
            <h4 className="font-bold text-gray-800 mb-4">RESUMO FINANCEIRO</h4>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-medium">Subtotal:</span>
                <span className="font-mono">{formatCurrency(data.subtotal)}</span>
              </div>
              {invoiceSettings.show_tax_details && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium">IVA (14%):</span>
                  <span className="font-mono">{formatCurrency(data.tax_total)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 bg-blue-600 text-white px-4 rounded font-bold text-lg">
                <span>TOTAL GERAL:</span>
                <span className="font-mono">{formatCurrency(data.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {invoiceSettings.show_bank_details && primaryBank && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-200">
            <h3 className="font-bold text-green-800 mb-4 text-lg flex items-center">
              <span className="bg-green-600 text-white p-2 rounded-full mr-3 text-sm">💳</span>
              DADOS PARA PAGAMENTO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-24">Banco:</span>
                  <span className="text-gray-900 font-medium">{primaryBank.bank_name}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-24">IBAN:</span>
                  <span className="text-gray-900 font-mono text-sm">{primaryBank.account_iban}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-24">Titular:</span>
                  <span className="text-gray-900 font-medium">{primaryBank.account_name}</span>
                </div>
                {primaryBank.swift_code && (
                  <div className="flex">
                    <span className="font-semibold text-gray-700 w-24">SWIFT:</span>
                    <span className="text-gray-900 font-mono">{primaryBank.swift_code}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proforma Warning */}
      {data.type === 'proforma' && (
        <div className="mb-8">
          <div className="bg-orange-100 border-l-4 border-orange-500 p-6 rounded-r-lg">
            <div className="flex items-center">
              <span className="text-orange-600 text-2xl mr-3">⚠️</span>
              <div>
                <h4 className="font-bold text-orange-800 text-lg">
                  FATURA PROFORMA - DOCUMENTO NÃO FISCAL
                </h4>
                <p className="text-orange-700 mt-1">
                  Este documento é apenas um orçamento e não constitui prova de pagamento ou documento fiscal válido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Notes */}
      <div className="space-y-6 text-sm text-gray-700">
        {invoiceSettings.invoice_terms && (
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center">
              <span className="bg-gray-600 text-white p-1 rounded mr-2 text-xs">📋</span>
              TERMOS E CONDIÇÕES
            </h4>
            <div className="whitespace-pre-line leading-relaxed">
              {invoiceSettings.invoice_terms}
            </div>
          </div>
        )}
        
        {data.notes && (
          <div className="bg-blue-50 p-6 rounded-lg border">
            <h4 className="font-bold text-blue-800 mb-3 flex items-center">
              <span className="bg-blue-600 text-white p-1 rounded mr-2 text-xs">📝</span>
              OBSERVAÇÕES
            </h4>
            <p className="leading-relaxed">{data.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 mt-8 pt-6 text-center space-y-4">
        {invoiceSettings.invoice_footer_text && (
          <div className="text-lg font-medium text-gray-800">
            {invoiceSettings.invoice_footer_text}
          </div>
        )}
        <div className="text-sm text-gray-500 space-y-1">
          <p>Processado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
          <p className="font-medium">
            {companySettings.company_name} • {companySettings.company_email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPrimaveraTemplate;
