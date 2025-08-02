import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductsFiltersProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  categories: any[];
  isMobile: boolean;
}

const ProductsFilters = ({
  activeTab,
  onTabChange,
  categories,
  isMobile
}: ProductsFiltersProps) => {
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1' : 'grid-cols-4 gap-2'} overflow-x-auto`}>
          <TabsTrigger value="all" className="text-xs sm:text-sm">Todos</TabsTrigger>
          <TabsTrigger value="low-stock" className="text-xs sm:text-sm">Estoque Baixo</TabsTrigger>
          <TabsTrigger value="out-of-stock" className="text-xs sm:text-sm">Sem Estoque</TabsTrigger>
          {categories.slice(0, isMobile ? 1 : 3).map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ProductsFilters;