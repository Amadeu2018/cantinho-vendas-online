
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuCard from "@/components/menu/MenuCard";
import { useDishes } from "@/hooks/use-dishes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart, Star, Clock, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const { dishes, loading, isFavorite, toggleFavorite, refetch } = useDishes();
  const { user } = useAuth();
  const { items } = useCart();

  const categories = [
    "Todos",
    "Peixes",
    "Carnes",
    "Vegetariano",
    "Sobremesas",
    "Bebidas"
  ];

  const priceRanges = [
    { label: "Todos", value: null },
    { label: "Até 2.000 AOA", value: "0-2000" },
    { label: "2.000 - 5.000 AOA", value: "2000-5000" },
    { label: "5.000 - 10.000 AOA", value: "5000-10000" },
    { label: "Acima de 10.000 AOA", value: "10000+" }
  ];

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Todos" || selectedCategory === null || 
                           dish.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
      matchesPrice = dish.price >= min && (max === undefined ? true : dish.price <= max);
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const featuredDishes = dishes.filter(dish => dish.rating >= 4.5).slice(0, 3);
  const popularDishes = dishes.filter(dish => dish.rating >= 4.0).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cantinho-cream/30 via-white to-cantinho-sand/20">
        <Navbar />
        <main className="pt-20 pb-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cantinho-cream/30 via-white to-cantinho-sand/20">
      <Navbar />
      
      <main className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-cantinho-navy mb-4">
              Nosso <span className="text-cantinho-terracotta">Cardápio</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra os sabores autênticos da culinária algarvia, preparados com ingredientes frescos e receitas tradicionais.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar pratos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-cantinho-terracotta"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category || (category === "Todos" && selectedCategory === null) ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category === "Todos" ? null : category)}
                    className="bg-cantinho-terracotta hover:bg-cantinho-navy"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Dishes */}
          {featuredDishes.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-cantinho-navy mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-cantinho-terracotta" />
                Pratos em Destaque
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDishes.map((dish) => (
                  <MenuCard
                    key={dish.id}
                    dish={dish}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Popular Dishes */}
          {popularDishes.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-cantinho-navy mb-6 flex items-center gap-2">
                <Users className="h-6 w-6 text-cantinho-terracotta" />
                Mais Pedidos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularDishes.map((dish) => (
                  <MenuCard
                    key={dish.id}
                    dish={dish}
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Dishes */}
          <section>
            <h2 className="text-3xl font-bold text-cantinho-navy mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-cantinho-terracotta" />
              Todos os Pratos
              <Badge variant="secondary" className="ml-2">
                {filteredDishes.length} pratos
              </Badge>
            </h2>
            
            {filteredDishes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Nenhum prato encontrado com os filtros selecionados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDishes.map((dish) => (
                  <MenuCard
                    key={dish.id}
                    dish={dish}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Floating Cart Button */}
          {items.length > 0 && (
            <Link to="/carrinho">
              <Button
                size="lg"
                className="fixed bottom-6 right-6 z-50 bg-cantinho-terracotta hover:bg-cantinho-navy shadow-lg rounded-full w-16 h-16 flex items-center justify-center"
              >
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 bg-cantinho-navy text-white">
                  {items.length}
                </Badge>
              </Button>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
