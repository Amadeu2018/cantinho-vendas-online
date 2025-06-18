
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderInvoice {
  id: string;
  number: string;
  total: number;
  created_at: string;
  status: string;
  type: 'order';
  customer_name: string;
  customer_email: string;
}

interface EventInvoice {
  id: string;
  numero: string;
  valor: number;
  created_at: string;
  status: string;
  type: 'event';
  customer_name: string;
  customer_email: string;
  event_type: string;
}

interface InvoiceCardProps {
  invoice: OrderInvoice | EventInvoice;
  onViewInvoice: (invoice: OrderInvoice | EventInvoice) => void;
  onDownloadInvoice: (invoice: OrderInvoice | EventInvoice) => void;
}

const InvoiceCard = ({ invoice, onViewInvoice, onDownloadInvoice }: InvoiceCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'pendente': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'pago': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'cancelado': 'bg-red-100 text-red-800',
    };

    const statusText = {
      'pending': 'Pendente',
      'pendente': 'Pendente',
      'completed': 'Completo',
      'pago': 'Pago',
      'cancelled': 'Cancelado',
      'cancelado': 'Cancelado',
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {statusText[status as keyof typeof statusText] || status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'event' ? (
      <Badge variant="secondary">Evento</Badge>
    ) : (
      <Badge variant="outline">Pedido</Badge>
    );
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getTypeBadge(invoice.type)}
              <span className="font-mono font-medium">
                {invoice.type === 'event' ? (invoice as EventInvoice).numero : (invoice as OrderInvoice).number}
              </span>
            </div>
            <p className="text-sm text-gray-600">{invoice.customer_name}</p>
            <p className="text-xs text-gray-500">{invoice.customer_email}</p>
            {invoice.type === 'event' && (
              <p className="text-xs text-gray-500">
                Evento: {(invoice as EventInvoice).event_type}
              </p>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            {getStatusBadge(invoice.status)}
          </div>
          <p className="font-semibold">
            {new Intl.NumberFormat('pt-AO', {
              style: 'currency',
              currency: 'AOA',
            }).format(invoice.type === 'event' ? (invoice as EventInvoice).valor : (invoice as OrderInvoice).total)}
          </p>
          <p className="text-xs text-gray-500">
            {format(new Date(invoice.created_at), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4 pt-4 border-t">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewInvoice(invoice)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Ver
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDownloadInvoice(invoice)}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default InvoiceCard;
