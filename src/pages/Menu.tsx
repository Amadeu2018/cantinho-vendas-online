
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuCard from "@/components/menu/MenuCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Tag, SlidersHorizontal, Filter, Star, Clock, ChefHat } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PromotionsSection from "@/components/promotions/PromotionsSection";
import { useDishes } from "@/hooks/use-dishes";
import { Dish } from "@/types/dish";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const { dishes, loading, isFavorite, toggleFavorite } = useDishes();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
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
    // Filter menu items based on search term, price filter, and favorites
    const filterItems = () => {
      const filtered = {
        appetizer: dishes.filter(dish => {
          const price = typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price;
          const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesPrice = priceFilter === "" || priceFilter === "all" || applyPriceFilter(price, priceFilter);
          const matchesFavorites = !showFavoritesOnly || isFavorite(dish.id);
          
          return dish.category === "appetizer" && matchesSearch && matchesPrice && matchesFavorites;
        }),
        main: dishes.filter(dish => {
          const price = typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price;
          const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesPrice = priceFilter === "" || priceFilter === "all" || applyPriceFilter(price, priceFilter);
          const matchesFavorites = !showFavoritesOnly || isFavorite(dish.id);
          
          return dish.category === "main" && matchesSearch && matchesPrice && matchesFavorites;
        }),
        dessert: dishes.filter(dish => {
          const price = typeof dish.price === 'string' ? parseFloat(dish.price) : dish.price;
          const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesPrice = priceFilter === "" || priceFilter === "all" || applyPriceFilter(price, priceFilter);
          const matchesFavorites = !showFavoritesOnly || isFavorite(dish.id);
          
          return dish.category === "dessert" && matchesSearch && matchesPrice && matchesFavorites;
        })
      };
      setFilteredItems(filtered);
    };

    filterItems();
  }, [dishes, searchTerm, priceFilter, showFavoritesOnly, isFavorite]);

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
    setShowFavoritesOnly(false);
  };

  const handleFirstOrder = () => {
    navigate('/primeiro-pedido');
  };

  const totalFilteredItems = filteredItems.appetizer.length + filteredItems.main.length + filteredItems.dessert.length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cantinho-cream/30 to-white">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          {/* Enhanced Header */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-20 h-1 bg-gradient-to-r from-cantinho-terracotta to-cantinho-navy rounded-full"></div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta bg-clip-text text-transparent animate-fade-in">
              Nosso Menu Completo
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed animate-fade-in">
              Descubra os melhores sabores da culinária portuguesa e angolana, preparados com ingredientes frescos e técnicas tradicionais por nossos chefs especializados.
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-8 animate-scale-in">
              <div className="text-center">
                <div className="bg-cantinho-terracotta/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                  <ChefHat className="w-8 h-8 text-cantinho-terracotta" />
                </div>
                <p className="text-2xl font-bold text-cantinho-navy">{dishes.length}</p>
                <p className="text-sm text-gray-600">Pratos Únicos</p>
              </div>
              <div className="text-center">
                <div className="bg-cantinho-terracotta/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-8 h-8 text-cantinho-terracotta" />
                </div>
                <p className="text-2xl font-bold text-cantinho-navy">25min</p>
                <p className="text-sm text-gray-600">Tempo Médio</p>
              </div>
              <div className="text-center">
                <div className="bg-cantinho-terracotta/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                  <Star className="w-8 h-8 text-cantinho-terracotta" />
                </div>
                <p className="text-2xl font-bold text-cantinho-navy">4.9</p>
                <p className="text-sm text-gray-600">Avaliação</p>
              </div>
            </div>
          </div>

          {/* First Order CTA */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 mb-8 text-white text-center shadow-xl animate-fade-in">
            <h3 className="text-2xl font-bold mb-2">Primeira vez no Cantinho Algarvio?</h3>
            <p className="mb-4 opacity-90">Ganhe 10% de desconto no seu primeiro pedido!</p>
            <Button
              onClick={handleFirstOrder}
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Começar Primeiro Pedido
            </Button>
          </div>

          <PromotionsSection />

          {/* Enhanced Filters Section */}
          <div className="mb-8 mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-cantinho-terracotta/10">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-cantinho-terracotta" />
                <h2 className="text-2xl font-bold text-cantinho-navy">Filtrar Menu</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Pesquisar pratos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 border-2 focus:border-cantinho-terracotta"
                  />
                </div>
                
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="border-2 focus:border-cantinho-terracotta">
                    <div className="flex items-center">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filtrar por preço" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os preços</SelectItem>
                    <SelectItem value="low">Econômico (&lt; 2.000 AOA)</SelectItem>
                    <SelectItem value="medium">Médio (2.000 - 3.500 AOA)</SelectItem>
                    <SelectItem value="high">Premium (&gt; 3.500 AOA)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={showFavoritesOnly ? "bg-cantinho-terracotta hover:bg-cantinho-terracotta/90" : "border-cantinho-terracotta text-cantinho-terracotta hover:bg-cantinho-terracotta hover:text-white"}
                >
                  <Star className="mr-2 h-4 w-4" />
                  Favoritos
                </Button>
              </div>
              
              {/* Active Filters */}
              {(searchTerm || priceFilter || showFavoritesOnly) && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Filtros ativos:</span>
                    {searchTerm && (
                      <Badge variant="outline" className="bg-cantinho-cream border-cantinho-terracotta">
                        Busca: "{searchTerm}"
                      </Badge>
                    )}
                    {priceFilter && priceFilter !== "all" && (
                      <Badge variant="outline" className="bg-cantinho-cream border-cantinho-terracotta">
                        Preço: {priceFilter === "low" ? "Econômico" : priceFilter === "medium" ? "Médio" : "Premium"}
                      </Badge>
                    )}
                    {showFavoritesOnly && (
                      <Badge variant="outline" className="bg-cantinho-cream border-cantinho-terracotta">
                        Apenas Favoritos
                      </Badge>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-sm text-cantinho-terracotta hover:underline ml-2 font-medium"
                    >
                      Limpar todos os filtros
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {totalFilteredItems} {totalFilteredItems === 1 ? 'prato encontrado' : 'pratos encontrados'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin w-12 h-12 border-4 border-cantinho-terracotta border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Carregando nosso delicioso menu...</p>
            </div>
          ) : (
            <Tabs defaultValue="main" className="w-full">
              <TabsList className={`w-full flex justify-center mb-8 bg-white shadow-lg border border-cantinho-terracotta/20 ${isMobile ? 'overflow-x-auto no-scrollbar' : ''}`}>
                <TabsTrigger value="appetizer" className="px-8 py-3 data-[state=active]:bg-cantinho-terracotta data-[state=active]:text-white">
                  Entradas ({filteredItems.appetizer.length})
                </TabsTrigger>
                <TabsTrigger value="main" className="px-8 py-3 data-[state=active]:bg-cantinho-terracotta data-[state=active]:text-white">
                  Pratos Principais ({filteredItems.main.length})
                </TabsTrigger>
                <TabsTrigger value="dessert" className="px-8 py-3 data-[state=active]:bg-cantinho-terracotta data-[state=active]:text-white">
                  Sobremesas ({filteredItems.dessert.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="appetizer">
                {filteredItems.appetizer.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.appetizer.map(dish => (
                      <MenuCard 
                        key={dish.id}
                        dish={dish}
                        isFavorite={isFavorite(dish.id)}
                        onToggleFavorite={() => toggleFavorite(dish.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Tag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-2xl font-medium text-gray-700 mb-2">Nenhuma entrada encontrada</h3>
                    <p className="text-gray-500 mb-4">Tente alterar seus filtros de busca</p>
                    <Button onClick={clearFilters} variant="outline">
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="main">
                {filteredItems.main.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.main.map(dish => (
                      <MenuCard 
                        key={dish.id}
                        dish={dish}
                        isFavorite={isFavorite(dish.id)}
                        onToggleFavorite={() => toggleFavorite(dish.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Tag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-2xl font-medium text-gray-700 mb-2">Nenhum prato principal encontrado</h3>
                    <p className="text-gray-500 mb-4">Tente alterar seus filtros de busca</p>
                    <Button onClick={clearFilters} variant="outline">
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="dessert">
                {filteredItems.dessert.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredItems.dessert.map(dish => (
                      <MenuCard 
                        key={dish.id}
                        dish={dish}
                        isFavorite={isFavorite(dish.id)}
                        onToggleFavorite={() => toggleFavorite(dish.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                    <Tag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-2xl font-medium text-gray-700 mb-2">Nenhuma sobremesa encontrada</h3>
                    <p className="text-gray-500 mb-4">Tente alterar seus filtros de busca</p>
                    <Button onClick={clearFilters} variant="outline">
                      Limpar Filtros
                    </Button>
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
