import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Users, MapPin, Phone, Mail, Clock, ArrowLeft, FileText, ListTodo, Building, BanknoteIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import EventInvoiceForm from "./EventInvoiceForm";
import type { EventRequest } from "./AdminEventRequests";

interface EventRequestDetailProps {
  request: EventRequest;
  onClose: () => void;
  onStatusChange: (requestId: string, status: string) => Promise<void>;
}

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

const EventRequestDetail = ({ request, onClose, onStatusChange }: EventRequestDetailProps) => {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchInvoices();
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

      // Atualizar o estado local
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

      // Atualizar o estado local
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista
        </Button>

        <div className="flex gap-2">
          {request.status !== "atendido" && (
            <Button
              size="sm"
              variant="default"
              onClick={() => onStatusChange(request.id, "atendido")}
              className="bg-green-600 hover:bg-green-700"
            >
              <Clock className="h-4 w-4 mr-1" />
              Marcar como Atendido
            </Button>
          )}

          {request.status !== "cancelado" && (
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => onStatusChange(request.id, "cancelado")}
            >
              Cancelar Solicitação
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
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
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Building className="h-5 w-5 mr-2 text-cantinho-terracotta" />
                  Detalhes do Cliente
                </h3>
                <div className="pl-7 space-y-2 mt-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Nome:</p>
                    <p>{request.nome}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{request.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{request.telefone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-cantinho-terracotta" />
                  Detalhes da Solicitação
                </h3>
                <div className="pl-7 space-y-3 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Recebido em</p>
                    <p className="font-medium">
                      {format(new Date(request.created_at), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                    </p>
                  </div>

                  {request.atendido_em && (
                    <div>
                      <p className="text-sm text-muted-foreground">Atendido em</p>
                      <p className="font-medium">
                        {format(new Date(request.atendido_em), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">ID da Solicitação</p>
                    <p className="font-medium font-mono">{request.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-cantinho-terracotta" />
                  Detalhes do Evento
                </h3>
                <div className="pl-7 space-y-3 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Evento</p>
                    <p className="font-medium">{request.tipo_evento}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data do Evento</p>
                    <p className="font-medium">
                      {format(new Date(request.data_evento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p>
                      <span className="font-medium">{request.num_convidados}</span> convidados
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <p>{request.localizacao}</p>
                  </div>
                </div>
              </div>

              {request.mensagem && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium flex items-center">
                      <ListTodo className="h-5 w-5 mr-2 text-cantinho-terracotta" />
                      Detalhes Adicionais
                    </h3>
                    <div className="pl-7 mt-2">
                      <p className="whitespace-pre-line text-muted-foreground">{request.mensagem}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Faturas
            </CardTitle>
            <Button onClick={() => setShowInvoiceForm(true)}>
              <FileText className="mr-2 h-4 w-4" />
              Nova Fatura
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingInvoices ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin h-6 w-6 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground opacity-50 mb-2" />
              <p>Nenhuma fatura emitida ainda</p>
              <p className="text-sm">Clique em "Nova Fatura" para criar uma fatura ou proforma</p>
            </div>
          ) : (
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
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Ver</span>
                          </Button>
                          {invoice.status !== "pago" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => handleMarkPaid(invoice.id)}
                            >
                              <BanknoteIcon className="h-4 w-4" />
                              <span className="sr-only">Marcar como Pago</span>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteInvoice(invoice.id)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRequestDetail;
