
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
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>;
    case "atendido":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Atendido</Badge>;
    case "cancelado":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const EventRequestsTableMobile = ({ requests, onSelectRequest }: Props) => {
  if (!requests.length) {
    return <div className="text-center py-8 text-sm">Nenhuma solicitação encontrada</div>;
  }

  return (
    <div className="space-y-4">
      {requests.map(req => (
        <div key={req.id} className="mobile-card-view">
          <div className="flex justify-between mb-2">
            <span className="mobile-card-label">Cliente:</span>
            <span className="mobile-card-value">{req.nome}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="mobile-card-label">Email:</span>
            <span className="mobile-card-value">{req.email}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="mobile-card-label">Tipo:</span>
            <span className="mobile-card-value">{req.tipo_evento}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="mobile-card-label">Data do Evento:</span>
            <span className="mobile-card-value">
              {format(new Date(req.data_evento), "dd/MM/yyyy")}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="mobile-card-label">Status:</span>
            <span>{getStatusBadge(req.status)}</span>
          </div>
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSelectRequest(req)}
            >
              <PenSquare className="h-4 w-4 mr-1" />
              Detalhes
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventRequestsTableMobile;
