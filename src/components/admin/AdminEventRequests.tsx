
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EventRequestDetail from "./EventRequestDetail";
import EventRequestsTable from "./EventRequestsTable";
import EventRequestsFilters from "./EventRequestsFilters";

export type EventRequest = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo_evento: string;
  data_evento: string;
  num_convidados: number;
  localizacao: string;
  mensagem?: string;
  status: string;
  created_at: string;
  atendido_em?: string;
  atendido_por?: string;
};

const AdminEventRequests = () => {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<EventRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEventRequests();

    // Configurar escuta em tempo real para atualizações de solicitações
    const channel = supabase
      .channel('event-requests-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'event_requests'
      }, payload => {
        if (payload.new) {
          setEventRequests(prev => 
            prev.map(request => 
              request.id === payload.new.id 
                ? { ...request, ...payload.new } 
                : request
            )
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEventRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_requests')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEventRequests(data as EventRequest[] || []);
    } catch (error: any) {
      console.error("Erro ao buscar solicitações:", error);
      toast({
        title: "Erro ao carregar solicitações",
        description: error.message || "Não foi possível carregar as solicitações de orçamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const updates: any = {
        status: newStatus,
      };
      
      // Se o status estiver mudando para "atendido", registrar a data e o atendente
      if (newStatus === "atendido") {
        updates.atendido_em = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('event_requests')
        .update(updates)
        .eq("id", requestId);

      if (error) throw error;

      // A atualização local será feita pelo listener em tempo real
      toast({
        title: "Status atualizado",
        description: `A solicitação foi marcada como ${newStatus}.`,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status da solicitação",
        variant: "destructive",
      });
    }
  };

  const handleSelectRequest = (request: EventRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
  };

  const filteredRequests = eventRequests.filter((request) => {
    const matchesSearch =
      request.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tipo_evento.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus ? request.status === selectedStatus : true;

    return matchesSearch && matchesStatus;
  });

  if (selectedRequest) {
    return (
      <EventRequestDetail
        request={selectedRequest}
        onClose={handleCloseDetail}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Solicitações de Orçamento para Eventos</CardTitle>
        <EventRequestsFilters 
          selectedStatus={selectedStatus} 
          setSelectedStatus={setSelectedStatus} 
        />
      </CardHeader>
      <CardContent>
        <EventRequestsTable 
          loading={loading}
          filteredRequests={filteredRequests}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSelectRequest={handleSelectRequest}
        />
      </CardContent>
    </Card>
  );
};

export default AdminEventRequests;
