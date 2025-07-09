import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductsFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  categories: any[];
  isMobile: boolean;
}

const ProductsFilters = ({ activeTab, onTabChange, categories, isMobile }: ProductsFiltersProps) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <div className="mb-4 overflow-x-auto">
        <TabsList className={`h-auto p-1 bg-gray-100 ${isMobile ? 'w-max flex no-scrollbar' : 'w-full flex-wrap justify-start'} gap-1`}>
          <TabsTrigger value="all" className="text-xs px-2 py-1.5 whitespace-nowrap flex-shrink-0">
            Todos
          </TabsTrigger>
          <TabsTrigger value="low-stock" className="text-xs px-2 py-1.5 whitespace-nowrap flex-shrink-0">
            Estoque Baixo
          </TabsTrigger>
          <TabsTrigger value="out-of-stock" className="text-xs px-2 py-1.5 whitespace-nowrap flex-shrink-0">
            Sem Estoque
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs px-2 py-1.5 whitespace-nowrap flex-shrink-0">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};

export default ProductsFilters;