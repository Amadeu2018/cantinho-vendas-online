
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeTab: string;
  onTabChange: (value: string) => void;
  categories: any[];
}

const ProductFilters = ({
  searchTerm,
  onSearchChange,
  activeTab,
  onTabChange,
  categories
}: ProductFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="relative md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produto..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="mb-2 w-full overflow-x-auto">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="low-stock">Estoque Baixo</TabsTrigger>
          <TabsTrigger value="out-of-stock">Sem Estoque</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProductFilters;
