
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { QrCode } from "lucide-react";

interface InvoiceHeaderProps {
  companySettings: any;
  invoiceSettings: any;
  data: {
    number: string;
    date: string;
    type: 'invoice' | 'proforma';
    payment_reference?: string;
  };
}

const InvoiceHeader = ({ companySettings, invoiceSettings, data }: InvoiceHeaderProps) => {
  return (
    <div className="border-b-4 border-gradient-to-r from-blue-600 to-indigo-600 pb-8 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 -m-6 mb-2 rounded-xl">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {invoiceSettings.show_company_logo && companySettings.company_logo_url && (
            <div className="mb-6">
              <img 
                src={companySettings.company_logo_url} 
                alt="Logo da Empresa" 
                className="h-24 max-w-56 object-contain drop-shadow-lg"
              />
            </div>
          )}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              {companySettings.company_name || 'Cantinho Angolano'}
            </h1>
            <div className="text-gray-700 space-y-2">
              {companySettings.company_address && (
                <p className="flex items-center text-sm">
                  <span className="font-semibold mr-3 text-blue-700">📍 Endereço:</span>
                  <span className="bg-white px-3 py-1 rounded-full shadow-sm">{companySettings.company_address}</span>
                </p>
              )}
              <div className="flex flex-wrap gap-6">
                {companySettings.company_phone && (
                  <p className="flex items-center text-sm">
                    <span className="font-semibold mr-3 text-blue-700">📞 Tel:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{companySettings.company_phone}</span>
                  </p>
                )}
                {companySettings.company_email && (
                  <p className="flex items-center text-sm">
                    <span className="font-semibold mr-3 text-blue-700">✉️ Email:</span>
                    <span className="bg-white px-3 py-1 rounded-full shadow-sm">{companySettings.company_email}</span>
                  </p>
                )}
              </div>
              {invoiceSettings.show_tax_details && companySettings.company_nif && (
                <p className="flex items-center text-sm">
                  <span className="font-semibold mr-3 text-blue-700">🏢 NIF:</span>
                  <span className="bg-white px-3 py-1 rounded-full shadow-sm font-mono">{companySettings.company_nif}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold">
              {data.type === 'proforma' ? 'FATURA PROFORMA' : 'FATURA'}
            </h2>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-blue-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-700">Número:</span>
              <span className="font-mono text-lg font-bold">{data.number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-700">Data:</span>
              <span className="font-medium">{format(new Date(data.date), "dd/MM/yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-700">Hora:</span>
              <span className="font-medium">{format(new Date(data.date), "HH:mm", { locale: ptBR })}</span>
            </div>
            {data.payment_reference && (
              <div className="flex justify-between items-center">
                <span className="font-semibold text-blue-700">Referência:</span>
                <span className="font-mono bg-blue-50 px-2 py-1 rounded">{data.payment_reference}</span>
              </div>
            )}
          </div>
          
          {invoiceSettings.show_qr_code && (
            <div className="bg-white border-2 border-blue-200 p-6 rounded-xl shadow-lg">
              <div className="flex flex-col items-center">
                <QrCode className="h-20 w-20 text-blue-400 mb-3" />
                <span className="text-sm text-blue-600 font-medium">Código QR</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
