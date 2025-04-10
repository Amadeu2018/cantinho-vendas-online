
import { Button } from "@/components/ui/button";

interface EventRequestsFiltersProps {
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
}

const EventRequestsFilters = ({ selectedStatus, setSelectedStatus }: EventRequestsFiltersProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => setSelectedStatus(null)} className={!selectedStatus ? "bg-muted" : ""}>
        Todos
      </Button>
      <Button size="sm" variant="outline" onClick={() => setSelectedStatus("pendente")} className={selectedStatus === "pendente" ? "bg-muted" : ""}>
        Pendentes
      </Button>
      <Button size="sm" variant="outline" onClick={() => setSelectedStatus("atendido")} className={selectedStatus === "atendido" ? "bg-muted" : ""}>
        Atendidos
      </Button>
    </div>
  );
};

export default EventRequestsFilters;
