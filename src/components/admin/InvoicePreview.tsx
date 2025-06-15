
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useRef } from "react";
import { usePDF } from "react-to-pdf";
import PrimaveraInvoiceTemplate from "./invoice/PrimaveraInvoiceTemplate";
import type { Invoice } from "./EventRequestDetail";
import type { EventRequest } from "./AdminEventRequests";

interface InvoicePreviewProps {
  invoice: Invoice;
  request: EventRequest;
  onBack: () => void;
  onExportPDF: (invoice: Invoice) => void;
}

const InvoicePreview = ({ invoice, request, onBack, onExportPDF }: InvoicePreviewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { toPDF } = usePDF({
    filename: `fatura-${invoice.numero}.pdf`
  });

  const handleDownloadPDF = () => {
    if (ref.current) {
      toPDF();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Transform data for the new template
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
        <div className="flex gap-2 print:hidden">
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
        <PrimaveraInvoiceTemplate data={invoiceData} />
      </Card>
    </div>
  );
};

export default InvoicePreview;
