
import { Building, Mail, Phone } from "lucide-react";
import type { EventRequest } from "./AdminEventRequests";

interface EventClientInfoProps {
  request: EventRequest;
}

const EventClientInfo = ({ request }: EventClientInfoProps) => {
  return (
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
  );
};

export default EventClientInfo;
