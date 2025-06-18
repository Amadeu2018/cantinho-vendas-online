
interface CustomerInfoProps {
  data: {
    customer: {
      name: string;
      email?: string;
      phone?: string;
      address?: string;
      nif?: string;
    };
    payment_method?: string;
  };
  invoiceSettings: any;
}

const CustomerInfo = ({ data, invoiceSettings }: CustomerInfoProps) => {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-100 shadow-lg">
        <h3 className="font-bold text-blue-900 mb-6 text-xl flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full mr-4 text-lg shadow-lg">🏢</span>
          DADOS DO CLIENTE
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="font-semibold text-blue-700 w-24 flex items-center">
                <span className="mr-2">👤</span>Nome:
              </span>
              <span className="text-gray-900 font-medium bg-white px-3 py-2 rounded-lg shadow-sm">
                {data.customer.name}
              </span>
            </div>
            {data.customer.email && (
              <div className="flex items-center">
                <span className="font-semibold text-blue-700 w-24 flex items-center">
                  <span className="mr-2">✉️</span>Email:
                </span>
                <span className="text-gray-900 bg-white px-3 py-2 rounded-lg shadow-sm">
                  {data.customer.email}
                </span>
              </div>
            )}
            {data.customer.phone && (
              <div className="flex items-center">
                <span className="font-semibold text-blue-700 w-24 flex items-center">
                  <span className="mr-2">📞</span>Tel:
                </span>
                <span className="text-gray-900 bg-white px-3 py-2 rounded-lg shadow-sm">
                  {data.customer.phone}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {data.customer.address && (
              <div className="flex items-center">
                <span className="font-semibold text-blue-700 w-24 flex items-center">
                  <span className="mr-2">📍</span>End:
                </span>
                <span className="text-gray-900 bg-white px-3 py-2 rounded-lg shadow-sm">
                  {data.customer.address}
                </span>
              </div>
            )}
            {data.customer.nif && invoiceSettings.show_tax_details && (
              <div className="flex items-center">
                <span className="font-semibold text-blue-700 w-24 flex items-center">
                  <span className="mr-2">🏢</span>NIF:
                </span>
                <span className="text-gray-900 font-mono bg-white px-3 py-2 rounded-lg shadow-sm">
                  {data.customer.nif}
                </span>
              </div>
            )}
            {data.payment_method && (
              <div className="flex items-center">
                <span className="font-semibold text-blue-700 w-24 flex items-center">
                  <span className="mr-2">💳</span>Pag:
                </span>
                <span className="text-gray-900 bg-white px-3 py-2 rounded-lg shadow-sm">
                  {data.payment_method}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
