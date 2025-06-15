
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { usePDF } from "react-to-pdf";
import PrimaveraInvoiceTemplate from "../admin/invoice/PrimaveraInvoiceTemplate";

interface OrderReceiptProps {
  order: {
    id: string;
    total: number;
    created_at: string;
    status: string;
    payment_status: string;
    payment_method?: string;
    payment_reference?: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;
    customer_info: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
    };
    subtotal?: number;
    delivery_fee?: number;
    notes?: string;
  };
}

const OrderReceipt = ({ order }: OrderReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toPDF } = usePDF({
    filename: `recibo-${order.id.slice(0, 8)}.pdf`
  });

  const handleDownloadPDF = () => {
    if (receiptRef.current) {
      toPDF();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      case 'paid': return 'Pago';
      case 'failed': return 'Falhado';
      default: return status;
    }
  };

  // Transform order data for the Primavera template
  const receiptData = {
    number: `REC-${order.id.slice(0, 8).toUpperCase()}`,
    date: order.created_at,
    type: 'invoice' as const,
    customer: {
      name: order.customer_info.name || 'Cliente',
      email: order.customer_info.email,
      phone: order.customer_info.phone,
      address: order.customer_info.address
    },
    items: order.items.map(item => ({
      description: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      tax_rate: 14,
      total: item.price * item.quantity
    })),
    subtotal: order.subtotal || (order.total - (order.delivery_fee || 0)),
    tax_total: (order.subtotal || order.total) * 0.14,
    total: order.total,
    payment_method: order.payment_method,
    payment_reference: order.payment_reference,
    notes: order.notes
  };

  return (
    <div className="space-y-6">
      {/* Header with Status and Actions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-cantinho-navy">
                Recibo do Pedido
              </h1>
              <p className="text-gray-600">#{order.id.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
            <Badge className={getStatusColor(order.payment_status)}>
              {getStatusText(order.payment_status)}
            </Badge>
          </div>
        </div>

        <div className="flex gap-2 print:hidden">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Baixar PDF
          </Button>
        </div>
      </Card>

      {/* Receipt using Primavera Template */}
      <Card className="print:shadow-none print:border-none" ref={receiptRef}>
        <PrimaveraInvoiceTemplate data={receiptData} />
      </Card>
    </div>
  );
};

export default OrderReceipt;
