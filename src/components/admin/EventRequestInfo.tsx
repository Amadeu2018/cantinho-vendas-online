
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EventRequest } from "./AdminEventRequests";

interface EventRequestInfoProps {
  request: EventRequest;
}

const EventRequestInfo = ({ request }: EventRequestInfoProps) => {
  return (
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
  );
};

export default EventRequestInfo;
