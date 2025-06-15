
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { format } from "date-fns";
import type { EventRequest } from "./AdminEventRequests";

type Props = {
  requests: EventRequest[];
  onSelectRequest: (request: EventRequest) => void;
};

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

const EventRequestsTableMobile = ({ requests, onSelectRequest }: Props) => {
  if (!requests.length) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-sm md:text-base text-gray-500">Nenhuma solicitação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {requests.map(req => (
        <div key={req.id} className="mobile-card-view bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm">
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between items-start gap-2">
              <span className="mobile-card-label text-xs md:text-sm text-gray-500">Cliente:</span>
              <span className="mobile-card-value text-sm md:text-base font-medium text-right">{req.nome}</span>
            </div>
            
            <div className="flex justify-between items-start gap-2">
              <span className="mobile-card-label text-xs md:text-sm text-gray-500">Email:</span>
              <span className="mobile-card-value text-sm md:text-base text-right break-all">{req.email}</span>
            </div>
            
            <div className="flex justify-between items-start gap-2">
              <span className="mobile-card-label text-xs md:text-sm text-gray-500">Tipo:</span>
              <span className="mobile-card-value text-sm md:text-base text-right">{req.tipo_evento}</span>
            </div>
            
            <div className="flex justify-between items-start gap-2">
              <span className="mobile-card-label text-xs md:text-sm text-gray-500">Data do Evento:</span>
              <span className="mobile-card-value text-sm md:text-base text-right">
                {format(new Date(req.data_evento), "dd/MM/yyyy")}
              </span>
            </div>
            
            <div className="flex justify-between items-center gap-2">
              <span className="mobile-card-label text-xs md:text-sm text-gray-500">Status:</span>
              <span>{getStatusBadge(req.status)}</span>
            </div>
            
            <div className="flex justify-end pt-2 border-t border-gray-100">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSelectRequest(req)}
                className="text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
              >
                <PenSquare className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                Detalhes
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventRequestsTableMobile;
