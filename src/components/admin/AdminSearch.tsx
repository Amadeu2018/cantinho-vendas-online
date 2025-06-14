
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  categories?: string[];
}

export interface SearchFilters {
  category?: string;
  status?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

const AdminSearch = ({ onSearch, placeholder = "Pesquisar...", categories = [] }: AdminSearchProps) => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const clearFilters = () => {
    setQuery("");
    setFilters({});
    onSearch("", {});
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </Button>
        {(query || Object.keys(filters).length > 0) && (
          <Button variant="outline" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select
                  value={filters.category || ""}
                  onValueChange={(value) => handleFilterChange('category', value || undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => handleFilterChange('status', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Data</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.dateRange?.from || ""}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    from: e.target.value
                  })}
                />
                <Input
                  type="date"
                  value={filters.dateRange?.to || ""}
                  onChange={(e) => handleFilterChange('dateRange', {
                    ...filters.dateRange,
                    to: e.target.value
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSearch;
