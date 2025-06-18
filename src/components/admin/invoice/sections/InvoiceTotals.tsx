
interface InvoiceTotalsProps {
  data: {
    subtotal: number;
    tax_total: number;
    total: number;
  };
  invoiceSettings: any;
  formatCurrency: (amount: number) => string;
}

const InvoiceTotals = ({ data, invoiceSettings, formatCurrency }: InvoiceTotalsProps) => {
  return (
    <div className="flex justify-end mb-8">
      <div className="w-96">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
          <h4 className="font-bold text-blue-800 mb-6 text-lg flex items-center">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-full mr-3 text-sm">💰</span>
            RESUMO FINANCEIRO
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-blue-200">
              <span className="font-medium text-gray-700">Subtotal:</span>
              <span className="font-mono text-gray-800 font-semibold">{formatCurrency(data.subtotal)}</span>
            </div>
            {invoiceSettings.show_tax_details && (
              <div className="flex justify-between py-3 border-b border-blue-200">
                <span className="font-medium text-gray-700">IVA (14%):</span>
                <span className="font-mono text-orange-600 font-semibold">{formatCurrency(data.tax_total)}</span>
              </div>
            )}
            <div className="flex justify-between py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 rounded-xl font-bold text-xl shadow-lg">
              <span>TOTAL GERAL:</span>
              <span className="font-mono">{formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
