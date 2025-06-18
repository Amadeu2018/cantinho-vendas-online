
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EventInvoiceForm from "../EventInvoiceForm";
import type { EventRequest } from "../AdminEventRequests";
import InvoicePreview from "../InvoicePreview";
import EventRequestSummary from "../EventRequestSummary";
import EventInvoicesList from "./EventInvoicesList";
import EventRequestHeader from "./EventRequestHeader";

export interface Invoice {
  id: string;
  tipo: string;
  numero: string;
  valor: number;
  status: string;
  created_at: string;
  data_pagamento?: string;
  descricao?: string;
}

interface EventRequestDetailProps {
  request: EventRequest;
  onClose: () => void;
  onStatusChange: (requestId: string, status: string) => Promise<void>;
}

const EventRequestDetail = ({ request, onClose, onStatusChange }: EventRequestDetailProps) => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();

    const channel = supabase
      .channel('event-request-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'event_requests',
        filter: `id=eq.${request.id}`
      }, payload => {
        if (payload.new) {
          request.status = payload.new.status;
          if (payload.new.atendido_em) {
            request.atendido_em = payload.new.atendido_em;
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [request.id]);

  const fetchInvoices = async () => {
    try {
      setLoadingInvoices(true);
      const { data, error } = await supabase
        .from('event_invoices')
        .select("*")
        .eq("event_request_id", request.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setInvoices(data as Invoice[] || []);
    } catch (error: any) {
      console.error("Erro ao buscar faturas:", error);
      toast({
        title: "Erro ao carregar faturas",
        description: error.message || "Não foi possível carregar as faturas associadas",
        variant: "destructive",
      });
    } finally {
      setLoadingInvoices(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case "atendido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Atendido</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      case "pago":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pago</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleMarkPaid = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('event_invoices')
        .update({
          status: "pago",
          data_pagamento: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      if (error) throw error;

      setInvoices(
        invoices.map((invoice) =>
          invoice.id === invoiceId
            ? { ...invoice, status: "pago", data_pagamento: new Date().toISOString() }
            : invoice
        )
      );

      toast({
        title: "Fatura atualizada",
        description: "A fatura foi marcada como paga.",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar fatura:", error);
      toast({
        title: "Erro ao atualizar fatura",
        description: error.message || "Ocorreu um erro ao marcar a fatura como paga",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('event_invoices')
        .delete()
        .eq("id", invoiceId);

      if (error) throw error;

      setInvoices(invoices.filter((invoice) => invoice.id !== invoiceId));

      toast({
        title: "Fatura excluída",
        description: "A fatura foi excluída com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao excluir fatura:", error);
      toast({
        title: "Erro ao excluir fatura",
        description: error.message || "Ocorreu um erro ao excluir a fatura",
        variant: "destructive",
      });
    }
  };

  if (showInvoiceForm) {
    return (
      <EventInvoiceForm
        eventRequest={request}
        onClose={() => {
          setShowInvoiceForm(false);
          fetchInvoices();
        }}
      />
    );
  }

  if (selectedInvoice) {
    return (
      <InvoicePreview 
        invoice={selectedInvoice} 
        request={request} 
        onBack={() => setSelectedInvoice(null)}
        onExportPDF={setSelectedInvoice}
      />
    );
  }

  return (
    <div className="space-y-6">
      <EventRequestHeader 
        requestId={request.id}
        status={request.status}
        onClose={onClose}
        onStatusChange={onStatusChange}
      />

      <EventRequestSummary 
        request={request} 
        statusBadge={getStatusBadge(request.status)} 
      />

      <EventInvoicesList 
        invoices={invoices}
        loadingInvoices={loadingInvoices}
        getStatusBadge={getStatusBadge}
        onShowInvoiceForm={() => setShowInvoiceForm(true)}
        onViewInvoice={setSelectedInvoice}
        onMarkPaid={handleMarkPaid}
        onDeleteInvoice={handleDeleteInvoice}
      />
    </div>
  );
};

export default EventRequestDetail;
