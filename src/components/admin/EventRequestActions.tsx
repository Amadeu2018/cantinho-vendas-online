
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventRequestActionsProps {
  requestId: string;
  status: string;
  onClose: () => void;
  onStatusChange: (requestId: string, status: string) => Promise<void>;
}

const EventRequestActions = ({ 
  requestId, 
  status, 
  onClose, 
  onStatusChange 
}: EventRequestActionsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center"
        onClick={onClose}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {isMobile ? "Voltar" : "Voltar para lista"}
      </Button>

      <div className="flex flex-wrap gap-2">
        {status !== "atendido" && (
          <Button
            size="sm"
            variant="default"
            onClick={() => onStatusChange(requestId, "atendido")}
            className="bg-green-600 hover:bg-green-700"
          >
            <Clock className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Marcar como Atendido</span>
            <span className="sm:hidden">Atendido</span>
          </Button>
        )}

        {status !== "cancelado" && (
          <Button
            size="sm"
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
            onClick={() => onStatusChange(requestId, "cancelado")}
          >
            <span className="hidden sm:inline">Cancelar Solicitação</span>
            <span className="sm:hidden">Cancelar</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventRequestActions;
