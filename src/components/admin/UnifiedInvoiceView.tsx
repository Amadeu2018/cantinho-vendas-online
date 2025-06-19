
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { usePDF } from "react-to-pdf";
import { useToast } from "@/hooks/use-toast";
import EnhancedPrimaveraTemplate from "./invoice/EnhancedPrimaveraTemplate";
import InvoiceActions from "./invoice/InvoiceActions";
import { useInvoiceData } from "./invoice/InvoiceDataProcessor";
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
  const { toast } = useToast();
  const { getInvoiceData, getTitle } = useInvoiceData({ order, eventInvoice, eventRequest });

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

  return (
    <div className="space-y-4 p-4 md:p-6">
      <InvoiceActions
        onBack={onBack}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        title={getTitle()}
      />

      <Card className="print:shadow-none print:border-none overflow-hidden" ref={invoiceRef}>
        <EnhancedPrimaveraTemplate data={invoiceData} />
      </Card>
    </div>
  );
};

export default UnifiedInvoiceView;
