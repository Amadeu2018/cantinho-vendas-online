
import React, { useState } from "react";
import { Star, Clock, Users, Filter, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuHero from "@/components/menu/MenuHero";
import MenuFilters from "@/components/menu/MenuFilters";
import MenuSection from "@/components/menu/MenuSection";
import FloatingCartButton from "@/components/menu/FloatingCartButton";
import { useDishes } from "@/hooks/use-dishes";
import { useCart } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { dishes, loading } = useDishes();
  const { items } = useCart();

  const categories = [
    "Todos",
    "Peixes",
    "Carnes",
    "Vegetariano",
    "Sobremesas",
    "Bebidas"
  ];

  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Todos" || selectedCategory === null || 
                           dish.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredDishes = dishes.filter(dish => dish.rating >= 4.5).slice(0, 3);
  const popularDishes = dishes.filter(dish => dish.rating >= 4.0).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cantinho-cream/30 via-white to-cantinho-sand/20">
        <Navbar />
        <main className="pt-20 pb-10">
          {/* Mobile-first loading skeleton */}
          <div className="container mx-auto px-4">
            <div className="mb-8 space-y-4">
              <Skeleton className="h-12 w-full max-w-md mx-auto" />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-24 flex-shrink-0" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      
      <main className="pt-16 sm:pt-20 pb-16">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          <MenuHero />
          
          {/* Mobile-optimized search and filters */}
          <div className="mb-6 sm:mb-8 space-y-4">
            {/* Search bar - Mobile first */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar pratos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 sm:py-2 border-2 border-gray-200 rounded-xl focus:border-cantinho-terracotta focus:outline-none text-base sm:text-sm bg-white shadow-sm"
              />
            </div>

            {/* Mobile filter toggle */}
            <div className="flex items-center justify-between sm:hidden">
              <h3 className="text-lg font-semibold text-cantinho-navy">
                {filteredDishes.length} pratos encontrados
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-cantinho-terracotta text-white rounded-lg font-medium"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>
            </div>

            {/* Category filters */}
            <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === "Todos" ? null : category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-300 flex-shrink-0 ${
                      (selectedCategory === category || (selectedCategory === null && category === "Todos"))
                        ? 'bg-cantinho-terracotta text-white shadow-lg'
                        : 'bg-white text-cantinho-navy border border-gray-200 hover:border-cantinho-terracotta hover:text-cantinho-terracotta'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured dishes - Mobile optimized */}
          {featuredDishes.length > 0 && (
            <MenuSection
              title="Pratos em Destaque"
              description="Nossos pratos mais premiados e apreciados pelos clientes"
              icon={<Star className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />}
              dishes={featuredDishes}
            />
          )}

          {/* Popular dishes - Mobile optimized */}
          {popularDishes.length > 0 && (
            <MenuSection
              title="Mais Pedidos"
              description="Os favoritos dos nossos clientes mais exigentes"
              icon={<Users className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />}
              dishes={popularDishes}
            />
          )}

          {/* All dishes - Mobile optimized */}
          <MenuSection
            title="Todos os Pratos"
            description="Explore toda nossa carta de sabores únicos e autênticos"
            icon={<Clock className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />}
            dishes={filteredDishes}
            showCount={true}
          />

          <FloatingCartButton itemsCount={items.length} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
