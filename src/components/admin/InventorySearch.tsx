
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface InventorySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const InventorySearch = ({ searchTerm, onSearchChange }: InventorySearchProps) => {
  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
      <Input
        placeholder="Buscar produto ou categoria..."
        className="pl-10 w-full"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default InventorySearch;
