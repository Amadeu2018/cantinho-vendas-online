
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { toPDF } from "react-to-pdf";
import type { Invoice } from "./EventRequestDetail";
import type { EventRequest } from "./AdminEventRequests";

interface InvoicePreviewProps {
  invoice: Invoice;
  request: EventRequest;
  onBack: () => void;
  onExportPDF: (invoice: Invoice) => void;
}

const InvoicePreview = ({ invoice, request, onBack, onExportPDF }: InvoicePreviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
          <Button onClick={() => window.print()} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={() => onExportPDF(invoice)} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </div>

      <Card className="p-6" id="invoice-container">
        <div className="invoice-container">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-cantinho-navy">Cantinho Algarvio</h2>
              <p>Rua Principal, 123</p>
              <p>Luanda, Angola</p>
              <p>Telefone: +244 123 456 789</p>
              <p>Email: info@cantinhoalgarvio.com</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold">
                {invoice.tipo === 'proforma' ? "FATURA PROFORMA" : "FATURA"}
              </h3>
              <p><strong>Nº:</strong> {invoice.numero}</p>
              <p><strong>Data:</strong> {format(new Date(invoice.created_at), "dd/MM/yyyy")}</p>
              <p><strong>Ref. Pedido:</strong> {request.id}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-2">Cliente</h4>
            <p><strong>Nome:</strong> {request.nome}</p>
            <p><strong>Email:</strong> {request.email}</p>
            <p><strong>Telefone:</strong> {request.telefone}</p>
            <p><strong>Endereço:</strong> {request.localizacao}</p>
          </div>
          
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-2">Detalhes do Evento</h4>
            <p><strong>Tipo de Evento:</strong> {request.tipo_evento}</p>
            <p><strong>Data do Evento:</strong> {format(new Date(request.data_evento), "dd/MM/yyyy")}</p>
            <p><strong>Número de Convidados:</strong> {request.num_convidados}</p>
          </div>
          
          <div className="mb-8">
            <h4 className="font-bold text-lg mb-2">Detalhes da Fatura</h4>
            {invoice.descricao && (
              <p className="mb-4">{invoice.descricao}</p>
            )}
            
            <div className="flex justify-end mt-4">
              <div className="w-64">
                <div className="flex justify-between py-2 border-t border-b">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">
                    {new Intl.NumberFormat('pt-AO', {
                      style: 'currency',
                      currency: 'AOA',
                      minimumFractionDigits: 0
                    }).format(invoice.valor)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <p><strong>Status:</strong> {invoice.status === 'pago' ? 'Pago' : 'Pendente'}</p>
            {invoice.data_pagamento && (
              <p><strong>Data de Pagamento:</strong> {format(new Date(invoice.data_pagamento), "dd/MM/yyyy")}</p>
            )}
          </div>
          
          {invoice.tipo === 'proforma' && (
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

export default InvoicePreview;
