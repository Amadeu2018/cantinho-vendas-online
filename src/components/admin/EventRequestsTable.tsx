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
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">Pendente</Badge>;
      case "atendido":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">Atendido</Badge>;
      case "cancelado":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">Cancelado</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search - Otimizado para mobile */}
      <div className="px-2 sm:px-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar solicitações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-base h-12 rounded-xl border-gray-200 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin h-8 w-8 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
        </div>
      ) : isMobile ? (
        <EventRequestsTableMobile requests={filteredRequests} onSelectRequest={onSelectRequest} />
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base">Nenhuma solicitação encontrada</p>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Data</TableHead>
                  <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Cliente</TableHead>
                  <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Tipo de Evento</TableHead>
                  <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Data do Evento</TableHead>
                  <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="px-3 py-4 whitespace-nowrap">
                      <span className="text-xs text-gray-600">
                        {format(new Date(request.created_at), "dd/MM/yyyy")}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <div className="max-w-[180px]">
                        <p className="font-medium text-gray-900 text-sm truncate">{request.nome}</p>
                        <p className="text-xs text-gray-500 truncate">{request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-4">
                      <span className="text-sm text-gray-900">{request.tipo_evento}</span>
                    </TableCell>
                    <TableCell className="px-3 py-4 whitespace-nowrap">
                      <span className="text-xs text-gray-600">
                        {format(new Date(request.data_evento), "dd/MM/yyyy")}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="px-3 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSelectRequest(request)}
                        className="text-xs h-7 px-2"
                      >
                        <PenSquare className="h-3 w-3 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRequestsTable;
