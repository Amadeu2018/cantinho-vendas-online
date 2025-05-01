
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { BanknoteIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Invoice } from "./EventRequestDetail";
import { useIsMobile } from "@/hooks/use-mobile";

interface InvoiceListProps {
  invoices: Invoice[];
  loadingInvoices: boolean;
  onViewInvoice: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => Promise<void>;
  onDeleteInvoice: (invoiceId: string) => Promise<void>;
  getStatusBadge: (status: string) => JSX.Element;
}

const InvoiceList = ({ 
  invoices, 
  loadingInvoices, 
  onViewInvoice, 
  onMarkPaid, 
  onDeleteInvoice,
  getStatusBadge 
}: InvoiceListProps) => {
  const isMobile = useIsMobile();
  
  const getInvoiceTypeBadge = (tipo: string) => {
    switch (tipo) {
      case "proforma":
        return <Badge variant="secondary">Proforma</Badge>;
      case "regular":
        return <Badge variant="default">Fatura</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  if (loadingInvoices) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin h-6 w-6 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <FileText className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-2" />
        <p>Nenhuma fatura emitida ainda</p>
        <p className="text-sm">Clique em "Nova Fatura" para criar uma fatura ou proforma</p>
      </div>
    );
  }

  // Versão para dispositivos móveis - cards ao invés de tabela
  if (isMobile) {
    return (
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="border rounded-md p-4 bg-white hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <div className="mb-2">{getInvoiceTypeBadge(invoice.tipo)}</div>
                <p className="font-mono font-medium">{invoice.numero}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(invoice.created_at), "dd/MM/yyyy")}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA',
                  }).format(invoice.valor)}
                </p>
                <div className="mt-1">{getStatusBadge(invoice.status)}</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 border-t pt-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onViewInvoice(invoice)}
                className="flex-1"
              >
                <FileText className="h-4 w-4 mr-2" />
                Ver
              </Button>
              {invoice.status !== "pago" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50 flex-1"
                  onClick={() => onMarkPaid(invoice.id)}
                >
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  Pago
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => onDeleteInvoice(invoice.id)}
              >
                &times;
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Versão para desktop - tabela
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2">Tipo</th>
            <th className="text-left py-3 px-2">Número</th>
            <th className="text-left py-3 px-2">Data</th>
            <th className="text-left py-3 px-2">Valor</th>
            <th className="text-left py-3 px-2">Status</th>
            <th className="text-right py-3 px-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2">{getInvoiceTypeBadge(invoice.tipo)}</td>
              <td className="py-3 px-2 font-mono">{invoice.numero}</td>
              <td className="py-3 px-2">
                {format(new Date(invoice.created_at), "dd/MM/yyyy")}
              </td>
              <td className="py-3 px-2 font-medium">
                {new Intl.NumberFormat('pt-AO', {
                  style: 'currency',
                  currency: 'AOA',
                }).format(invoice.valor)}
              </td>
              <td className="py-3 px-2">{getStatusBadge(invoice.status)}</td>
              <td className="py-3 px-2 text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onViewInvoice(invoice)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Ver</span>
                  </Button>
                  {invoice.status !== "pago" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => onMarkPaid(invoice.id)}
                    >
                      <BanknoteIcon className="h-4 w-4" />
                      <span className="sr-only">Marcar como Pago</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => onDeleteInvoice(invoice.id)}
                  >
                    <span className="sr-only">Excluir</span>
                    &times;
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceList;
