
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenSquare, Calendar, User, Mail, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import type { EventRequest } from "./AdminEventRequests";

type Props = {
  requests: EventRequest[];
  onSelectRequest: (request: EventRequest) => void;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pendente":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs px-2 py-1">Pendente</Badge>;
    case "atendido":
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs px-2 py-1">Atendido</Badge>;
    case "cancelado":
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs px-2 py-1">Cancelado</Badge>;
    default:
      return <Badge variant="outline" className="text-xs px-2 py-1">{status}</Badge>;
  }
};

const EventRequestsTableMobile = ({ requests, onSelectRequest }: Props) => {
  if (!requests.length) {
    return (
      <div className="text-center py-12 px-4">
        <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-base">Nenhuma solicitação encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-2">
      {requests.map(req => (
        <div 
          key={req.id} 
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm active:shadow-md transition-shadow touch-manipulation"
          onClick={() => onSelectRequest(req)}
        >
          <div className="space-y-4">
            {/* Header com status */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium text-gray-900 text-base">{req.nome}</span>
              </div>
              {getStatusBadge(req.status)}
            </div>
            
            {/* Informações principais */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600 break-all">{req.email}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{req.tipo_evento}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(req.data_evento), "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">{req.num_convidados} convidados</span>
              </div>
              
              {req.localizacao && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{req.localizacao}</span>
                </div>
              )}
            </div>
            
            {/* Botão de ação */}
            <div className="pt-3 border-t border-gray-100">
              <Button
                size="sm"
                variant="ghost"
                className="w-full h-10 text-sm font-medium justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRequest(req);
                }}
              >
                <PenSquare className="h-4 w-4 mr-2" />
                Ver Detalhes
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventRequestsTableMobile;
