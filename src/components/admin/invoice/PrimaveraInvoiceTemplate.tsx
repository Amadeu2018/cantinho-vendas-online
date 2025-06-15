
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCompanySettings } from "@/hooks/company/use-company-settings";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";
import { useBankAccounts } from "@/hooks/company/use-bank-accounts";

interface PrimaveraInvoiceTemplateProps {
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

const PrimaveraInvoiceTemplate = ({ data }: PrimaveraInvoiceTemplateProps) => {
  const { settings: companySettings } = useCompanySettings();
  const { settings: invoiceSettings } = useInvoiceSettings();
  const { accounts: bankAccounts } = useBankAccounts();

  const primaryBank = bankAccounts.find(acc => acc.is_primary && acc.is_active) || bankAccounts[0];

  return (
    <div className="bg-white p-6 font-sans text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {invoiceSettings.show_company_logo && companySettings.company_logo_url && (
              <img 
                src={companySettings.company_logo_url} 
                alt="Logo" 
                className="h-16 mb-2"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              {companySettings.company_name || 'Cantinho Angolano'}
            </h1>
            <div className="text-gray-600 text-xs space-y-1">
              {companySettings.company_address && <p>{companySettings.company_address}</p>}
              <div className="flex gap-4">
                {companySettings.company_phone && <span>Tel: {companySettings.company_phone}</span>}
                {companySettings.company_email && <span>Email: {companySettings.company_email}</span>}
              </div>
              {companySettings.company_nif && <p>NIF: {companySettings.company_nif}</p>}
            </div>
          </div>
          
          <div className="text-right">
            <div className="bg-gray-800 text-white px-4 py-2 rounded mb-2">
              <h2 className="text-lg font-bold">
                {data.type === 'proforma' ? 'FATURA PROFORMA' : 'FATURA'}
              </h2>
            </div>
            <div className="text-xs space-y-1">
              <p><strong>Nº:</strong> {data.number}</p>
              <p><strong>Data:</strong> {format(new Date(data.date), "dd/MM/yyyy", { locale: ptBR })}</p>
              <p><strong>Hora:</strong> {format(new Date(data.date), "HH:mm", { locale: ptBR })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-bold text-gray-800 mb-2 text-sm">DADOS DO CLIENTE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p><strong>Nome:</strong> {data.customer.name}</p>
              {data.customer.email && <p><strong>Email:</strong> {data.customer.email}</p>}
              {data.customer.phone && <p><strong>Telefone:</strong> {data.customer.phone}</p>}
            </div>
            <div>
              {data.customer.address && <p><strong>Endereço:</strong> {data.customer.address}</p>}
              {data.customer.nif && <p><strong>NIF:</strong> {data.customer.nif}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border border-gray-300 p-2 text-left">DESCRIÇÃO</th>
              <th className="border border-gray-300 p-2 text-center w-16">QTD</th>
              <th className="border border-gray-300 p-2 text-right w-20">PREÇO UNIT.</th>
              {invoiceSettings.show_tax_details && (
                <th className="border border-gray-300 p-2 text-center w-16">IVA</th>
              )}
              <th className="border border-gray-300 p-2 text-right w-24">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="border border-gray-300 p-2">{item.description}</td>
                <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {item.unit_price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </td>
                {invoiceSettings.show_tax_details && (
                  <td className="border border-gray-300 p-2 text-center">
                    {item.tax_rate || 14}%
                  </td>
                )}
                <td className="border border-gray-300 p-2 text-right font-semibold">
                  {item.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>{data.subtotal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
            </div>
            {invoiceSettings.show_tax_details && (
              <div className="flex justify-between py-1">
                <span>IVA (14%):</span>
                <span>{data.tax_total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
              </div>
            )}
            <div className="border-t border-gray-800 pt-1 mt-2">
              <div className="flex justify-between py-1 font-bold text-base">
                <span>TOTAL:</span>
                <span>{data.total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      {invoiceSettings.show_bank_details && primaryBank && (
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-bold text-blue-900 mb-2 text-sm">DADOS PARA PAGAMENTO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p><strong>Banco:</strong> {primaryBank.bank_name}</p>
                <p><strong>IBAN:</strong> {primaryBank.account_iban}</p>
              </div>
              <div>
                <p><strong>Titular:</strong> {primaryBank.account_name}</p>
                {primaryBank.swift_code && <p><strong>SWIFT:</strong> {primaryBank.swift_code}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proforma Warning */}
      {data.type === 'proforma' && (
        <div className="mb-6 p-4 border-2 border-dashed border-orange-400 bg-orange-50 text-center">
          <p className="font-bold text-orange-800 text-sm">
            FATURA PROFORMA - DOCUMENTO NÃO FISCAL
          </p>
          <p className="text-xs text-orange-700 mt-1">
            Este documento é apenas um orçamento e não constitui prova de pagamento.
          </p>
        </div>
      )}

      {/* Terms and Footer */}
      <div className="text-xs text-gray-600 space-y-2">
        {invoiceSettings.invoice_terms && (
          <div>
            <h4 className="font-semibold mb-1">TERMOS E CONDIÇÕES:</h4>
            <p className="whitespace-pre-line">{invoiceSettings.invoice_terms}</p>
          </div>
        )}
        
        {data.notes && (
          <div>
            <h4 className="font-semibold mb-1">OBSERVAÇÕES:</h4>
            <p>{data.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 mt-6 pt-4 text-center text-xs text-gray-500">
        <p>{invoiceSettings.invoice_footer_text || "Obrigado pela sua preferência!"}</p>
        <p className="mt-1">Processado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
      </div>
    </div>
  );
};

export default PrimaveraInvoiceTemplate;
