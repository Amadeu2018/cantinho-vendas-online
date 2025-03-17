
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuCard from "@/components/menu/MenuCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Tag, SlidersHorizontal } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PromotionsSection from "@/components/promotions/PromotionsSection";
import { useDishes, Dish } from "@/hooks/use-dishes";

const Menu = () => {
  const { dishes, loading, isFavorite, toggleFavorite } = useDishes();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [filteredItems, setFilteredItems] = useState<{
    appetizer: Dish[];
    main: Dish[];
    dessert: Dish[];
  }>({
    appetizer: [],
    main: [],
    dessert: []
  });

  useEffect(() => {
    // Filter menu items based on search term and price filter
    const filterItems = () => {
      const filtered = {
        appetizer: dishes.filter(dish => 
          dish.category === "appetizer" && 
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (priceFilter === "" || applyPriceFilter(dish.price, priceFilter))
        ),
        main: dishes.filter(dish => 
          dish.category === "main" && 
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (priceFilter === "" || applyPriceFilter(dish.price, priceFilter))
        ),
        dessert: dishes.filter(dish => 
          dish.category === "dessert" && 
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (priceFilter === "" || applyPriceFilter(dish.price, priceFilter))
        )
      };
      setFilteredItems(filtered);
    };

    filterItems();
  }, [dishes, searchTerm, priceFilter]);

  const applyPriceFilter = (price: number, filter: string): boolean => {
    switch (filter) {
      case "low":
        return price < 2000;
      case "medium":
        return price >= 2000 && price < 3500;
      case "high":
        return price >= 3500;
      default:
        return true;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-3 text-cantinho-navy">Nosso Menu</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra os melhores sabores da culinária portuguesa e angolana, preparados com ingredientes frescos e técnicas tradicionais.
            </p>
          </div>

          <PromotionsSection />

          <div className="mb-8 mt-12">
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
                    <SelectItem value="">Todos os preços</SelectItem>
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
                    Preço: {priceFilter === "low" ? "Econômico" : priceFilter === "medium" ? "Médio" : "Premium"}
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

          {loading ? (
            <div className="text-center py-16">
              <p>Carregando menu...</p>
            </div>
          ) : (
            <Tabs defaultValue="main" className="w-full">
              <TabsList className="w-full flex justify-center mb-8">
                <TabsTrigger value="appetizer" className="px-6">Entradas</TabsTrigger>
                <TabsTrigger value="main" className="px-6">Pratos Principais</TabsTrigger>
                <TabsTrigger value="dessert" className="px-6">Sobremesas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appetizer">
                {filteredItems.appetizer.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.appetizer.map(dish => (
                      <MenuCard 
                        key={dish.id} 
                        dish={dish} 
                        onToggleFavorite={toggleFavorite}
                        isFavorite={isFavorite(dish.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">Nenhum prato encontrado</h3>
                    <p className="text-gray-500 mt-2">Tente alterar seus filtros de busca</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="main">
                {filteredItems.main.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.main.map(dish => (
                      <MenuCard 
                        key={dish.id} 
                        dish={dish} 
                        onToggleFavorite={toggleFavorite}
                        isFavorite={isFavorite(dish.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">Nenhum prato encontrado</h3>
                    <p className="text-gray-500 mt-2">Tente alterar seus filtros de busca</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="dessert">
                {filteredItems.dessert.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.dessert.map(dish => (
                      <MenuCard 
                        key={dish.id} 
                        dish={dish} 
                        onToggleFavorite={toggleFavorite}
                        isFavorite={isFavorite(dish.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">Nenhum prato encontrado</h3>
                    <p className="text-gray-500 mt-2">Tente alterar seus filtros de busca</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
