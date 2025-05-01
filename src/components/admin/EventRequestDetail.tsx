
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Users, MapPin, Phone, Mail, Clock, ArrowLeft, FileText, ListTodo, Building, BanknoteIcon, Download, Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EventInvoiceForm from "./EventInvoiceForm";
import { usePDF } from "react-to-pdf";
import type { EventRequest } from "./AdminEventRequests";
import EventClientInfo from "./EventClientInfo";
import EventRequestInfo from "./EventRequestInfo";
import EventDetailsInfo from "./EventDetailsInfo";
import InvoiceList from "./InvoiceList";
import InvoicePreview from "./InvoicePreview";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const targetRef = useRef<HTMLDivElement>(null);
  const { toPDF } = usePDF();
  const isMobile = useIsMobile();

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

  const handleExportInvoicePDF = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
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
        onExportPDF={handleExportInvoicePDF}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {isMobile ? "Voltar" : "Voltar para lista"}
        </Button>

        <div className="flex flex-wrap gap-2">
          {request.status !== "atendido" && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onStatusChange(request.id, "atendido")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Clock className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Marcar como Atendido</span>
              <span className="sm:hidden">Atendido</span>
            </Button>
          )}

          {request.status !== "cancelado" && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => onStatusChange(request.id, "cancelado")}
            >
              <span className="hidden sm:inline">Cancelar Solicitação</span>
              <span className="sm:hidden">Cancelar</span>
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Detalhes da Solicitação</CardTitle>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Status:</div>
              {getStatusBadge(request.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <EventClientInfo request={request} />
              <Separator className="my-4" />
              <EventRequestInfo request={request} />
            </div>

            <div className="space-y-4">
              <EventDetailsInfo request={request} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Faturas
            </CardTitle>
            <Button onClick={() => setShowInvoiceForm(true)}>
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Nova Fatura</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <InvoiceList 
            invoices={invoices} 
            loadingInvoices={loadingInvoices} 
            onViewInvoice={setSelectedInvoice}
            onMarkPaid={handleMarkPaid}
            onDeleteInvoice={handleDeleteInvoice}
            getStatusBadge={getStatusBadge}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRequestDetail;
