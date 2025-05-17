
import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

type MenuFiltersProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceFilter: string;
  setPriceFilter: (filter: string) => void;
  clearFilters: () => void;
};

const MenuFilters: React.FC<MenuFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  priceFilter,
  setPriceFilter,
  clearFilters,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-cantinho-navy mb-4">Explorar Menu</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Pesquisar pratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Preço" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os preços</SelectItem>
              <SelectItem value="low">Econômico (&lt; 2.000 AOA)</SelectItem>
              <SelectItem value="medium">Médio (2.000 - 3.500 AOA)</SelectItem>
              <SelectItem value="high">Premium (&gt; 3.500 AOA)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {(searchTerm || priceFilter) && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtros:</span>
          {searchTerm && (
            <Badge variant="outline" className="bg-cantinho-cream">
              Busca: {searchTerm}
            </Badge>
          )}
          {priceFilter && (
            <Badge variant="outline" className="bg-cantinho-cream">
              Preço: {priceFilter === "low" ? "Econômico" : priceFilter === "medium" ? "Médio" : priceFilter === "high" ? "Premium" : "Todos"}
            </Badge>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-cantinho-terracotta hover:underline ml-2"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuFilters;
