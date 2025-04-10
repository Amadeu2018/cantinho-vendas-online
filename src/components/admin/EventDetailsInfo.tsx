
import { CalendarDays, Users, MapPin, ListTodo } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import type { EventRequest } from "./AdminEventRequests";

interface EventDetailsInfoProps {
  request: EventRequest;
}

const EventDetailsInfo = ({ request }: EventDetailsInfoProps) => {
  return (
    <>
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
    </>
  );
};

export default EventDetailsInfo;
