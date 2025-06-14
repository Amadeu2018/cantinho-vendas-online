import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuCard from "@/components/menu/MenuCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, Star, Heart } from "lucide-react";
import { useDishes } from "@/hooks/use-dishes";
import { useCart } from "@/contexts/CartContext";
import { Dish } from "@/types/dish";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PromotionsSection from "@/components/promotions/PromotionsSection";

const Menu = () => {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('categoria');
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "all");
  const [sortBy, setSortBy] = useState("name");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [priceRange, setPriceRange] = useState("all");

  const { dishes, isLoading, error } = useDishes();
  const { favorites, addToFavorites, removeFromFavorites } = useCart();

  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dishesPerPage = 12;

  useEffect(() => {
    if (dishes) {
      let results = [...dishes];

      if (searchTerm) {
        results = results.filter(dish =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedCategory !== "all") {
        results = results.filter(dish => dish.category === selectedCategory);
      }

      if (showFavoritesOnly) {
        results = results.filter(dish => favorites.includes(parseInt(dish.id)));
      }

      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        results = results.filter(dish => dish.price >= min && dish.price <= max);
      }

      if (sortBy === "name") {
        results.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "price") {
        results.sort((a, b) => a.price - b.price);
      } else if (sortBy === "rating" && results.every(dish => dish.rating !== undefined)) {
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setFilteredDishes(results);
      setCurrentPage(1); // Reset page when filters change
    }
  }, [dishes, searchTerm, selectedCategory, sortBy, showFavoritesOnly, priceRange, favorites]);

  const totalPages = Math.ceil(filteredDishes.length / dishesPerPage);
  const startIndex = (currentPage - 1) * dishesPerPage;
  const endIndex = startIndex + dishesPerPage;
  const paginatedDishes = filteredDishes.slice(startIndex, endIndex);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
  };

  const handleToggleFavorite = async (dishId: number) => {
    const isFav = favorites.includes(dishId);
    if (isFav) {
      await removeFromFavorites(dishId);
    } else {
      await addToFavorites(dishId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="container mx-auto px-4 flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cantinho-terracotta"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="container mx-auto px-4 text-center">
            <p className="text-red-600">Erro ao carregar o menu: {error.message}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-cantinho-navy">Nosso Menu</h1>
            <Input
              type="search"
              placeholder="Buscar pratos..."
              className="max-w-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="pizza">Pizzas</SelectItem>
                <SelectItem value="burger">Burgers</SelectItem>
                <SelectItem value="salad">Saladas</SelectItem>
                <SelectItem value="dessert">Sobremesas</SelectItem>
                {/* Adicione mais categorias conforme necessário */}
              </SelectContent>
            </Select>

            <Select onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="price">Preço</SelectItem>
                {dishes.every(dish => dish.rating !== undefined) && (
                  <SelectItem value="rating">Avaliação</SelectItem>
                )}
              </SelectContent>
            </Select>

            <Select onValueChange={handlePriceRangeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Faixa de Preço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Faixas</SelectItem>
                <SelectItem value="0-2500">0 - 2500 AOA</SelectItem>
                <SelectItem value="2500-5000">2500 - 5000 AOA</SelectItem>
                <SelectItem value="5000-10000">5000 - 10000 AOA</SelectItem>
                {/* Adicione mais faixas de preço conforme necessário */}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Heart className="h-4 w-4" />
              {showFavoritesOnly ? "Remover Favoritos" : "Mostrar Favoritos"}
            </Button>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedDishes.map((dish) => (
              <MenuCard 
                key={dish.id} 
                dish={dish}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </Button>
              <span className="mx-4">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próximo
              </Button>
            </div>
          )}

          {/* Empty State */}
          {filteredDishes.length === 0 && (
            <div className="text-center mt-10">
              <p className="text-gray-500">Nenhum prato encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Menu;
