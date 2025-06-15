
import { useRef } from "react";
import { format } from "date-fns";
import { Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Download, Printer } from "lucide-react";
import { usePDF } from "react-to-pdf";
import PrimaveraInvoiceTemplate from "./invoice/PrimaveraInvoiceTemplate";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";

type AdminInvoiceProps = {
  order: Order & { isProforma?: boolean };
};

const AdminInvoice = ({ order }: AdminInvoiceProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { settings } = useInvoiceSettings();
  const { toPDF } = usePDF({
    filename: `${order.isProforma ? 'proforma' : 'fatura'}-${order.id.slice(4, 12)}.pdf`
  });

  const date = new Date(order.createdAt);
  const invoiceNumber = order.isProforma 
    ? `${settings.proforma_number_prefix}-${order.id.slice(4, 12).toUpperCase()}`
    : `${settings.invoice_number_prefix}-${order.id.slice(4, 12).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (invoiceRef.current) {
      toPDF();
    }
  };

  // Transform order data to invoice template format
  const invoiceData = {
    number: invoiceNumber,
    date: order.createdAt,
    type: order.isProforma ? 'proforma' as const : 'invoice' as const,
    customer: {
      name: order.customerInfo.name,
      email: order.customerInfo.email,
      phone: order.customerInfo.phone,
      address: order.customerInfo.address,
      nif: order.customerInfo.nif || undefined
    },
    items: order.items.map(item => ({
      description: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      tax_rate: 14,
      total: item.price * item.quantity
    })),
    subtotal: order.subtotal,
    tax_total: order.subtotal * 0.14, // 14% IVA
    total: order.total,
    payment_method: order.paymentMethod?.name,
    payment_reference: order.payment_reference || undefined,
    notes: order.notes
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
      
      <Card className="print:shadow-none print:border-none" ref={invoiceRef}>
        <PrimaveraInvoiceTemplate data={invoiceData} />
      </Card>
    </div>
  );
};

export default AdminInvoice;
