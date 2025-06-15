
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuCard from "@/components/menu/MenuCard";
import { useDishes } from "@/hooks/use-dishes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ShoppingCart, Star, Clock, Users, ChefHat } from "lucide-react";
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
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Hero Section - More Professional */}
          <div className="relative text-center mb-16 py-12">
            <div className="absolute inset-0 bg-gradient-to-r from-cantinho-navy/5 to-cantinho-terracotta/5 rounded-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6">
                <ChefHat className="h-12 w-12 text-cantinho-terracotta mr-4" />
                <h1 className="text-5xl md:text-6xl font-bold text-cantinho-navy">
                  Nosso <span className="text-cantinho-terracotta bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand bg-clip-text text-transparent">Cardápio</span>
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Descubra os sabores autênticos da culinária algarvia, preparados com ingredientes frescos 
                e receitas tradicionais passadas de geração em geração.
              </p>
              <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>Pratos Premiados</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-cantinho-terracotta mr-1" />
                  <span>Entrega Rápida</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-cantinho-navy mr-1" />
                  <span>+1000 Clientes Satisfeitos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters - Enhanced Design */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-12">
            <div className="flex flex-col space-y-6">
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Buscar pratos deliciosos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-cantinho-terracotta rounded-2xl shadow-sm"
                />
              </div>
              
              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category || (category === "Todos" && selectedCategory === null) ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category === "Todos" ? null : category)}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      selectedCategory === category || (category === "Todos" && selectedCategory === null)
                        ? "bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand text-white shadow-lg"
                        : "bg-white hover:bg-cantinho-cream border-2 border-gray-200 hover:border-cantinho-terracotta text-gray-700"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Dishes - Enhanced Section */}
          {featuredDishes.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-cantinho-navy mb-4 flex items-center justify-center gap-3">
                  <Star className="h-8 w-8 text-cantinho-terracotta" />
                  Pratos em Destaque
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Nossos pratos mais premiados e apreciados pelos clientes
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredDishes.map((dish) => (
                  <div key={dish.id} className="transform hover:scale-105 transition-transform duration-300">
                    <MenuCard dish={dish} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Popular Dishes - Enhanced Section */}
          {popularDishes.length > 0 && (
            <section className="mb-16">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-cantinho-navy mb-4 flex items-center justify-center gap-3">
                  <Users className="h-8 w-8 text-cantinho-terracotta" />
                  Mais Pedidos
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Os favoritos dos nossos clientes mais exigentes
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {popularDishes.map((dish) => (
                  <div key={dish.id} className="transform hover:scale-105 transition-transform duration-300">
                    <MenuCard dish={dish} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* All Dishes - Enhanced Section */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-cantinho-navy mb-4 flex items-center justify-center gap-3">
                <Clock className="h-8 w-8 text-cantinho-terracotta" />
                Todos os Pratos
                <Badge variant="secondary" className="ml-3 px-4 py-2 text-lg bg-cantinho-sand text-cantinho-navy">
                  {filteredDishes.length} pratos disponíveis
                </Badge>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore toda nossa carta de sabores únicos e autênticos
              </p>
            </div>
            
            {filteredDishes.length === 0 ? (
              <div className="text-center py-20 bg-white/50 rounded-3xl">
                <div className="max-w-md mx-auto">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-600 mb-2">Nenhum prato encontrado</h3>
                  <p className="text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDishes.map((dish) => (
                  <div key={dish.id} className="transform hover:scale-105 transition-transform duration-300">
                    <MenuCard dish={dish} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Floating Cart Button - Enhanced */}
          {items.length > 0 && (
            <Link to="/carrinho">
              <Button
                size="lg"
                className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand hover:from-cantinho-sand hover:to-cantinho-terracotta shadow-2xl rounded-full w-20 h-20 flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
              >
                <ShoppingCart className="h-7 w-7 text-white" />
                <Badge className="absolute -top-2 -right-2 bg-cantinho-navy text-white text-sm px-2 py-1 rounded-full">
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
