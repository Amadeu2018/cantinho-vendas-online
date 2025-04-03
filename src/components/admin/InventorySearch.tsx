
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface InventorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const InventorySearch = ({ searchTerm, onSearchChange }: InventorySearchProps) => {
  return (
    <div className="relative md:w-72">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar item..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default InventorySearch;
