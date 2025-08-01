
import { useRef } from "react";
import { format } from "date-fns";
import { Order } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Download, Printer } from "lucide-react";
import { usePDF } from "react-to-pdf";
import EnhancedPrimaveraTemplate from "./invoice/EnhancedPrimaveraTemplate";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";
import { useToast } from "@/hooks/use-toast";

type AdminInvoiceProps = {
  order: Order & { isProforma?: boolean };
};

const AdminInvoice = ({ order }: AdminInvoiceProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { settings } = useInvoiceSettings();
  const { toast } = useToast();
  const { toPDF } = usePDF({
    filename: `${order.isProforma ? 'proforma' : 'fatura'}-${order.id.slice(4, 12)}.pdf`,
    page: {
      margin: 10,
      format: 'a4',
      orientation: 'portrait',
    }
  });

  const date = new Date(order.createdAt);
  const invoiceNumber = order.isProforma 
    ? `${settings.proforma_number_prefix}-${order.id.slice(4, 12).toUpperCase()}`
    : `${settings.invoice_number_prefix}-${order.id.slice(4, 12).toUpperCase()}`;

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow && invoiceRef.current) {
        const content = invoiceRef.current.innerHTML;
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${order.isProforma ? 'Proforma' : 'Fatura'} ${invoiceNumber}</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                @media print {
                  body { margin: 0; padding: 20px; }
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        
        toast({
          title: "Impressão iniciada",
          description: `${order.isProforma ? 'A proforma' : 'A fatura'} ${invoiceNumber} foi enviada para impressão.`,
        });
      }
    } catch (error) {
      console.error("Erro ao imprimir:", error);
      toast({
        title: "Erro ao imprimir",
        description: "Não foi possível imprimir o documento.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (invoiceRef.current) {
        await toPDF();
        toast({
          title: "PDF gerado com sucesso",
          description: `${order.isProforma ? 'A proforma' : 'A fatura'} ${invoiceNumber} foi baixada.`,
        });
      }
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo PDF.",
        variant: "destructive",
      });
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
      nif: (order.customerInfo as any).nif || undefined
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
    payment_method: (order as any).paymentMethod?.name || (order as any).payment_method,
    payment_reference: (order as any).payment_reference || undefined,
    notes: order.notes
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h3 className="text-xl font-bold">
          {order.isProforma ? "Fatura Proforma" : "Fatura"}
        </h3>
        <div className="flex gap-2 no-print">
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
        <EnhancedPrimaveraTemplate data={invoiceData} />
      </Card>
    </div>
  );
};

export default AdminInvoice;
