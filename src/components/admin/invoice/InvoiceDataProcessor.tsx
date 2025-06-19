
import type { Order } from "@/contexts/CartContext";
import type { EventRequest } from "../AdminEventRequests";
import type { Invoice } from "../EventRequestDetail";
import { useInvoiceSettings } from "@/hooks/company/use-invoice-settings";

interface InvoiceDataProcessorProps {
  order?: Order & { isProforma?: boolean };
  eventInvoice?: Invoice;
  eventRequest?: EventRequest;
}

export const useInvoiceData = ({ order, eventInvoice, eventRequest }: InvoiceDataProcessorProps) => {
  const { settings } = useInvoiceSettings();

  const getInvoiceData = () => {
    const isOrderInvoice = !!order;
    const isEventInvoice = !!eventInvoice && !!eventRequest;

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

  const getTitle = () => {
    if (order) {
      return order.isProforma ? "Fatura Proforma" : "Fatura";
    } else if (eventInvoice) {
      return eventInvoice.tipo === 'proforma' ? "Fatura Proforma" : "Fatura";
    }
    return "Fatura";
  };

  return { getInvoiceData, getTitle };
};
