
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, PenSquare } from "lucide-react";
import { format } from "date-fns";
import EventRequestDetail from "./EventRequestDetail";

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

  const filteredRequests = eventRequests.filter((request) => {
    const matchesSearch =
      request.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tipo_evento.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus ? request.status === selectedStatus : true;

    return matchesSearch && matchesStatus;
  });

  const handleSelectRequest = (request: EventRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendente":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
      case "atendido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Atendido</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setSelectedStatus(null)} className={!selectedStatus ? "bg-muted" : ""}>
            Todos
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedStatus("pendente")} className={selectedStatus === "pendente" ? "bg-muted" : ""}>
            Pendentes
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedStatus("atendido")} className={selectedStatus === "atendido" ? "bg-muted" : ""}>
            Atendidos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar solicitações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo de Evento</TableHead>
                  <TableHead>Data do Evento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {format(new Date(request.created_at), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.nome}</p>
                        <p className="text-xs text-muted-foreground">{request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.tipo_evento}</TableCell>
                    <TableCell>
                      {format(new Date(request.data_evento), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSelectRequest(request)}
                      >
                        <PenSquare className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminEventRequests;
