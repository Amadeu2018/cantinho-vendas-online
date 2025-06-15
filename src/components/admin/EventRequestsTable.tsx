import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenSquare, Search } from "lucide-react";
import type { EventRequest } from "./AdminEventRequests";
import { useIsMobile } from "@/hooks/use-mobile";
import EventRequestsTableMobile from "./EventRequestsTableMobile";

interface EventRequestsTableProps {
  loading: boolean;
  filteredRequests: EventRequest[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectRequest: (request: EventRequest) => void;
}

const EventRequestsTable = ({ 
  loading, 
  filteredRequests, 
  searchTerm, 
  setSearchTerm, 
  onSelectRequest 
}: EventRequestsTableProps) => {
  
  const isMobile = useIsMobile();

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

  return (
    <>
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
      ) : isMobile ? (
        <EventRequestsTableMobile requests={filteredRequests} onSelectRequest={onSelectRequest} />
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[700px]">
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
                      onClick={() => onSelectRequest(request)}
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
    </>
  );
};

export default EventRequestsTable;
