
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useRef } from "react";
import { usePDF } from "react-to-pdf";
import EnhancedPrimaveraTemplate from "./invoice/EnhancedPrimaveraTemplate";
import type { Invoice } from "./EventRequestDetail";
import type { EventRequest } from "./AdminEventRequests";
import { useToast } from "@/hooks/use-toast";

interface InvoicePreviewProps {
  invoice: Invoice;
  request: EventRequest;
  onBack: () => void;
  onExportPDF?: (invoice: Invoice) => void;
}

const InvoicePreview = ({ invoice, request, onBack, onExportPDF }: InvoicePreviewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { toPDF } = usePDF({
    filename: `fatura-${invoice.numero}.pdf`,
    page: {
      margin: 10,
      format: 'a4',
      orientation: 'portrait',
    }
  });

  const handleDownloadPDF = async () => {
    try {
      if (ref.current) {
        await toPDF();
        toast({
          title: "PDF gerado com sucesso",
          description: `A fatura ${invoice.numero} foi baixada.`,
        });
        if (onExportPDF) {
          onExportPDF(invoice);
        }
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
      if (printWindow && ref.current) {
        const content = ref.current.innerHTML;
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Fatura ${invoice.numero}</title>
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
          description: `A fatura ${invoice.numero} foi enviada para impressão.`,
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

  // Transform data for the enhanced template
  const invoiceData = {
    number: invoice.numero,
    date: invoice.created_at,
    type: invoice.tipo === 'proforma' ? 'proforma' as const : 'invoice' as const,
    customer: {
      name: request.nome,
      email: request.email,
      phone: request.telefone,
      address: request.localizacao
    },
    items: [{
      description: invoice.descricao || `Serviço de Catering para ${request.tipo_evento}`,
      quantity: 1,
      unit_price: invoice.valor,
      tax_rate: 14,
      total: invoice.valor
    }],
    subtotal: invoice.valor / 1.14, // Remove IVA to get subtotal
    tax_total: invoice.valor - (invoice.valor / 1.14), // Calculate IVA
    total: invoice.valor,
    payment_method: "Transferência Bancária",
    notes: `Evento: ${request.tipo_evento} • Data: ${request.data_evento} • Convidados: ${request.num_convidados}`
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex gap-2 no-print">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </Button>
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Baixar PDF</span>
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none" ref={ref}>
        <EnhancedPrimaveraTemplate data={invoiceData} />
      </Card>
    </div>
  );
};

export default InvoicePreview;
