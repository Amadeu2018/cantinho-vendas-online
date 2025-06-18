
import React from "react";
import { useCompanySettings } from "@/hooks/company/use-company-settings";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";
import { useBankAccounts } from "@/hooks/company/use-bank-accounts";
import InvoiceHeader from "./sections/InvoiceHeader";
import CustomerInfo from "./sections/CustomerInfo";
import InvoiceTable from "./sections/InvoiceTable";
import InvoiceTotals from "./sections/InvoiceTotals";

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: invoiceSettings.default_currency || 'AOA'
    }).format(amount);
  };

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: 'Arial, sans-serif' }}>
      <InvoiceHeader 
        companySettings={companySettings}
        invoiceSettings={invoiceSettings}
        data={data}
      />

      <CustomerInfo data={data} invoiceSettings={invoiceSettings} />

      <InvoiceTable 
        data={data} 
        invoiceSettings={invoiceSettings} 
        formatCurrency={formatCurrency} 
      />

      <InvoiceTotals 
        data={data} 
        invoiceSettings={invoiceSettings} 
        formatCurrency={formatCurrency} 
      />

      {/* Payment Information */}
      {invoiceSettings.show_bank_details && primaryBank && (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-green-200 shadow-lg">
            <h3 className="font-bold text-green-800 mb-6 text-xl flex items-center">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-full mr-4 text-lg shadow-lg">💳</span>
              DADOS PARA PAGAMENTO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-green-700 w-24 flex items-center">
                    <span className="mr-2">🏦</span>Banco:
                  </span>
                  <span className="text-gray-900 font-medium bg-white px-4 py-2 rounded-lg shadow-sm">
                    {primaryBank.bank_name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-green-700 w-24 flex items-center">
                    <span className="mr-2">🔢</span>IBAN:
                  </span>
                  <span className="text-gray-900 font-mono text-sm bg-white px-4 py-2 rounded-lg shadow-sm">
                    {primaryBank.account_iban}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-semibold text-green-700 w-24 flex items-center">
                    <span className="mr-2">👤</span>Titular:
                  </span>
                  <span className="text-gray-900 font-medium bg-white px-4 py-2 rounded-lg shadow-sm">
                    {primaryBank.account_name}
                  </span>
                </div>
                {primaryBank.swift_code && (
                  <div className="flex items-center">
                    <span className="font-semibold text-green-700 w-24 flex items-center">
                      <span className="mr-2">🌐</span>SWIFT:
                    </span>
                    <span className="text-gray-900 font-mono bg-white px-4 py-2 rounded-lg shadow-sm">
                      {primaryBank.swift_code}
                    </span>
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
          <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-l-8 border-orange-500 p-8 rounded-r-2xl shadow-lg">
            <div className="flex items-center">
              <span className="text-orange-600 text-4xl mr-4">⚠️</span>
              <div>
                <h4 className="font-bold text-orange-800 text-xl mb-2">
                  FATURA PROFORMA - DOCUMENTO NÃO FISCAL
                </h4>
                <p className="text-orange-700 text-lg leading-relaxed">
                  Este documento é apenas um orçamento e não constitui prova de pagamento ou documento fiscal válido.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Notes */}
      <div className="space-y-8 text-sm text-gray-700">
        {invoiceSettings.invoice_terms && (
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
              <span className="bg-gradient-to-r from-gray-600 to-slate-600 text-white p-2 rounded-full mr-3 text-sm">📋</span>
              TERMOS E CONDIÇÕES
            </h4>
            <div className="whitespace-pre-line leading-relaxed text-gray-700 bg-white p-6 rounded-xl">
              {invoiceSettings.invoice_terms}
            </div>
          </div>
        )}
        
        {data.notes && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg">
            <h4 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-full mr-3 text-sm">📝</span>
              OBSERVAÇÕES
            </h4>
            <p className="leading-relaxed text-gray-700 bg-white p-6 rounded-xl">{data.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t-4 border-gradient-to-r from-blue-600 to-indigo-600 mt-12 pt-8 text-center space-y-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 -m-8 mt-4 rounded-t-2xl">
        {invoiceSettings.invoice_footer_text && (
          <div className="text-xl font-medium text-blue-800 bg-white px-6 py-3 rounded-xl shadow-sm">
            {invoiceSettings.invoice_footer_text}
          </div>
        )}
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-medium">
            Processado em {new Date().toLocaleDateString("pt-AO")} às {new Date().toLocaleTimeString("pt-AO", { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="font-semibold text-blue-700">
            {companySettings.company_name} • {companySettings.company_email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPrimaveraTemplate;
