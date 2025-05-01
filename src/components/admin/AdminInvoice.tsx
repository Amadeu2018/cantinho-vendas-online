
import { useRef } from "react";
import { format } from "date-fns";
import { Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Download, Printer } from "lucide-react";
import { usePDF } from "react-to-pdf";

type AdminInvoiceProps = {
  order: Order & { isProforma?: boolean };
};

const AdminInvoice = ({ order }: AdminInvoiceProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toPDF } = usePDF({
    filename: `${order.isProforma ? 'proforma' : 'fatura'}-${order.id.slice(4, 12)}.pdf`
  });
  
  const date = new Date(order.createdAt);
  const formattedDate = format(date, "dd/MM/yyyy");
  const invoiceDate = format(new Date(), "dd/MM/yyyy");
  const invoiceNumber = order.isProforma 
    ? `PRO-${order.id.slice(4, 12).toUpperCase()}`
    : `FAT-${order.id.slice(4, 12).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (invoiceRef.current) {
      toPDF();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-bold">
          {order.isProforma ? "Fatura Proforma" : "Fatura"}
        </h3>
        <div className="flex gap-2 print:hidden">
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Baixar PDF</span>
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
        </div>
      </div>
      
      <Card className="p-4 sm:p-6" ref={invoiceRef}>
        <div className="invoice-container">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-cantinho-navy">Cantinho Algarvio</h2>
              <p>Rua Principal, 123</p>
              <p>Luanda, Angola</p>
              <p>Telefone: +244 123 456 789</p>
              <p>Email: info@cantinhoalgarvio.com</p>
            </div>
            <div className="text-left sm:text-right mt-4 sm:mt-0">
              <h3 className="text-xl font-bold">
                {order.isProforma ? "FATURA PROFORMA" : "FATURA"}
              </h3>
              <p><strong>Nº:</strong> {invoiceNumber}</p>
              <p><strong>Data:</strong> {invoiceDate}</p>
              <p><strong>Ref. Pedido:</strong> {order.id}</p>
              <p><strong>Data Pedido:</strong> {formattedDate}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-2">Cliente</h4>
            <p><strong>Nome:</strong> {order.customerInfo.name}</p>
            <p><strong>Endereço:</strong> {order.customerInfo.address}</p>
            <p><strong>Telefone:</strong> {order.customerInfo.phone}</p>
          </div>
          
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-2">Detalhes do {order.isProforma ? "Orçamento" : "Pedido"}</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Item</th>
                    <th className="border p-2 text-right">Preço Unit.</th>
                    <th className="border p-2 text-right">Qtd.</th>
                    <th className="border p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2 text-right">{formatCurrency(item.price)}</td>
                      <td className="border p-2 text-right">{item.quantity}</td>
                      <td className="border p-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end">
            <div className="w-full sm:w-64">
              <div className="flex justify-between py-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Taxa de Entrega:</span>
                <span>{formatCurrency(order.deliveryFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between py-2 font-bold">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h4 className="font-bold text-lg mb-2">Informações de Pagamento</h4>
            <p><strong>Método:</strong> {order.paymentMethod.name}</p>
            <p><strong>Status:</strong> {order.paymentStatus === "completed" ? "Pago" : "Pendente"}</p>
          </div>
          
          {order.isProforma && (
            <div className="mt-8 p-4 border border-dashed border-gray-400 text-center">
              <p className="font-bold text-lg">FATURA PROFORMA - NÃO VÁLIDA COMO FATURA</p>
              <p>Este documento é apenas um orçamento e não constitui prova de pagamento.</p>
              <p>Válido por 15 dias a partir da data de emissão.</p>
            </div>
          )}
          
          <div className="mt-8">
            <p className="text-center text-gray-600 text-sm">
              Agradecemos a sua preferência!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminInvoice;
