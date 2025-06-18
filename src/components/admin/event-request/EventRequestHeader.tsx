
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EventRequestHeaderProps {
  requestId: string;
  status: string;
  onClose: () => void;
  onStatusChange: (requestId: string, status: string) => Promise<void>;
}

const EventRequestHeader = ({ requestId, status, onClose, onStatusChange }: EventRequestHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h2 className="text-xl font-semibold">Detalhes da Solicitação</h2>
      </div>
      
      <div className="flex gap-2">
        {status === "pendente" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(requestId, "atendido")}
              className="text-green-600 hover:text-green-700"
            >
              Marcar como Atendido
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(requestId, "cancelado")}
              className="text-red-600 hover:text-red-700"
            >
              Cancelar
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventRequestHeader;
