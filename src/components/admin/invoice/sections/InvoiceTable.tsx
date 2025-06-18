
interface InvoiceTableProps {
  data: {
    items: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      tax_rate?: number;
      total: number;
    }>;
  };
  invoiceSettings: any;
  formatCurrency: (amount: number) => string;
}

const InvoiceTable = ({ data, invoiceSettings, formatCurrency }: InvoiceTableProps) => {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-blue-900 mb-6 text-xl flex items-center">
        <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-full mr-4 text-lg shadow-lg">📋</span>
        ITENS DA FATURA
      </h3>
      <div className="overflow-x-auto rounded-2xl shadow-lg border-2 border-blue-100">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <th className="p-5 text-left font-bold text-sm uppercase tracking-wide">DESCRIÇÃO</th>
              <th className="p-5 text-center font-bold text-sm uppercase tracking-wide w-20">QTD</th>
              <th className="p-5 text-right font-bold text-sm uppercase tracking-wide w-32">PREÇO UNIT.</th>
              {invoiceSettings.show_tax_details && (
                <th className="p-5 text-center font-bold text-sm uppercase tracking-wide w-20">IVA %</th>
              )}
              <th className="p-5 text-right font-bold text-sm uppercase tracking-wide w-32">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-blue-50/50" : "bg-white"}>
                <td className="p-5 border-b border-blue-100">
                  <div className="font-medium text-gray-800">{item.description}</div>
                </td>
                <td className="p-5 text-center font-bold text-blue-700 border-b border-blue-100">
                  {item.quantity}
                </td>
                <td className="p-5 text-right font-mono text-gray-700 border-b border-blue-100">
                  {formatCurrency(item.unit_price)}
                </td>
                {invoiceSettings.show_tax_details && (
                  <td className="p-5 text-center text-orange-600 font-semibold border-b border-blue-100">
                    {item.tax_rate || 14}%
                  </td>
                )}
                <td className="p-5 text-right font-bold font-mono text-green-700 border-b border-blue-100">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceTable;
