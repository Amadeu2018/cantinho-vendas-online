
import { useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { usePDF } from "react-to-pdf";
import { useToast } from "@/hooks/use-toast";
import EnhancedPrimaveraTemplate from "./invoice/EnhancedPrimaveraTemplate";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";
import type { Order } from "@/contexts/CartContext";
import type { EventRequest } from "./AdminEventRequests";
import type { Invoice } from "./EventRequestDetail";

interface UnifiedInvoiceViewProps {
  // For order invoices
  order?: Order & { isProforma?: boolean };
  // For event invoices
  eventInvoice?: Invoice;
  eventRequest?: EventRequest;
  onBack: () => void;
}

const UnifiedInvoiceView = ({ order, eventInvoice, eventRequest, onBack }: UnifiedInvoiceViewProps) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { settings } = useInvoiceSettings();
  const { toast } = useToast();

  // Determine if this is an order or event invoice
  const isOrderInvoice = !!order;
  const isEventInvoice = !!eventInvoice && !!eventRequest;

  // Generate appropriate filename and number
  const getInvoiceData = () => {
    if (isOrderInvoice && order) {
      const invoiceNumber = order.isProforma 
        ? `${settings.proforma_number_prefix}-${order.id.slice(4, 12).toUpperCase()}`
        : `${settings.invoice_number_prefix}-${order.id.slice(4, 12).toUpperCase()}`;

      return {
        filename: `${order.isProforma ? 'proforma' : 'fatura'}-${order.id.slice(4, 12)}.pdf`,
        invoiceData: {
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
          tax_total: order.subtotal * 0.14,
          total: order.total,
          payment_method: (order as any).paymentMethod?.name || (order as any).payment_method,
          payment_reference: (order as any).payment_reference || undefined,
          notes: order.notes
        }
      };
    } else if (isEventInvoice && eventInvoice && eventRequest) {
      return {
        filename: `fatura-${eventInvoice.numero}.pdf`,
        invoiceData: {
          number: eventInvoice.numero,
          date: eventInvoice.created_at,
          type: eventInvoice.tipo === 'proforma' ? 'proforma' as const : 'invoice' as const,
          customer: {
            name: eventRequest.nome,
            email: eventRequest.email,
            phone: eventRequest.telefone,
            address: eventRequest.localizacao
          },
          items: [{
            description: eventInvoice.descricao || `Serviço de Catering para ${eventRequest.tipo_evento}`,
            quantity: 1,
            unit_price: eventInvoice.valor,
            tax_rate: 14,
            total: eventInvoice.valor
          }],
          subtotal: eventInvoice.valor / 1.14,
          tax_total: eventInvoice.valor - (eventInvoice.valor / 1.14),
          total: eventInvoice.valor,
          payment_method: "Transferência Bancária",
          notes: `Evento: ${eventRequest.tipo_evento} • Data: ${eventRequest.data_evento} • Convidados: ${eventRequest.num_convidados}`
        }
      };
    }
    
    throw new Error("Dados de fatura inválidos");
  };

  const { filename, invoiceData } = getInvoiceData();
  
  const { toPDF } = usePDF({
    filename,
    page: {
      margin: 10,
      format: 'a4',
      orientation: 'portrait',
    }
  });

  const handleDownloadPDF = async () => {
    try {
      if (invoiceRef.current) {
        await toPDF();
        toast({
          title: "PDF gerado com sucesso",
          description: `A fatura ${invoiceData.number} foi baixada.`,
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

  const handlePrint = () => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow && invoiceRef.current) {
        const content = invoiceRef.current.innerHTML;
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Fatura ${invoiceData.number}</title>
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
          description: `A fatura ${invoiceData.number} foi enviada para impressão.`,
        });
      }
    } catch (error) {
      console.error("Erro ao imprimir:", error);
      toast({
        title: "Erro ao imprimir",
        description: "Não foi possível imprimir a fatura.",
        variant: "destructive",
      });
    }
  };

  const getTitle = () => {
    if (isOrderInvoice && order) {
      return order.isProforma ? "Fatura Proforma" : "Fatura";
    } else if (isEventInvoice && eventInvoice) {
      return eventInvoice.tipo === 'proforma' ? "Fatura Proforma" : "Fatura";
    }
    return "Fatura";
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h3 className="text-xl font-bold">{getTitle()}</h3>
        </div>
        
        <div className="flex gap-2 no-print w-full sm:w-auto">
          <Button 
            onClick={handlePrint} 
            className="flex items-center gap-2 flex-1 sm:flex-none"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden xs:inline">Imprimir</span>
          </Button>
          <Button 
            onClick={handleDownloadPDF} 
            className="flex items-center gap-2 flex-1 sm:flex-none"
          >
            <Download className="h-4 w-4" />
            <span className="hidden xs:inline">Baixar PDF</span>
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none overflow-hidden" ref={invoiceRef}>
        <EnhancedPrimaveraTemplate data={invoiceData} />
      </Card>
    </div>
  );
};

export default UnifiedInvoiceView;
