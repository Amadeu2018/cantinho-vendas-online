import React, { useState } from "react";
import { Star, Clock, Users, Filter, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuHero from "@/components/menu/MenuHero";
import MenuSection from "@/components/menu/MenuSection";
import FloatingCartButton from "@/components/menu/FloatingCartButton";
import LoadMoreButton from "@/components/common/LoadMoreButton";
import MenuFilters from "@/components/menu/MenuFilters";
import { usePaginatedDishes } from "@/hooks/use-paginated-dishes";
import { useCart } from "@/contexts/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import MenuCard from "@/components/menu/MenuCard";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { items } = useCart();

  const { 
    dishes: allDishes, 
    loading, 
    hasMore, 
    totalCount, 
    loadMore 
  } = usePaginatedDishes({ 
    pageSize: 12, 
    searchTerm, 
    category: selectedCategory 
  });

  const { 
    dishes: featuredDishes 
  } = usePaginatedDishes({ 
    pageSize: 3, 
    featured: true 
  });

  const { 
    dishes: popularDishes 
  } = usePaginatedDishes({ 
    pageSize: 3, 
    popular: true 
  });

  const categories = [
    "Todos",
    "Entradas",
    "Peixes e Frutos do Mar",
    "Carnes",
    "Pratos Vegetarianos",
    "Massas",
    "Sobremesas",
    "Bebidas",
    "Vinhos",
    "Pratos Tradicionais"
  ];

  const filteredDishes = allDishes.filter(dish => {
    const matchesCategory = selectedCategory ? dish.category === selectedCategory : true;
    const matchesSearchTerm = dish.title && dish.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  console.log("Selected Category:", selectedCategory);
  console.log("Search Term:", searchTerm);

  console.log(allDishes);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (loading && allDishes.length === 0) {
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
          
          <MenuFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            totalCount={totalCount}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            allDishes={allDishes}
          />

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

          {/* All dishes with pagination */}
          <section className="mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-10 px-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cantinho-navy mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-cantinho-terracotta" />
                  <span>Todos os Pratos</span>
                </div>
                {totalCount > 0 && (
                  <div className="px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-lg bg-cantinho-sand text-cantinho-navy mt-2 sm:mt-0 sm:ml-3 rounded-full">
                    {totalCount} pratos
                  </div>
                )}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                Explore toda nossa carta de sabores únicos e autênticos
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
              {filteredDishes.map((dish) => (
                <div key={dish.id} className="transform hover:scale-105 transition-transform duration-300 h-full">
                  <MenuCard dish={dish} />
                </div>
              ))}
            </div>

            {/* Load more button */}
            {filteredDishes.length > 0 && (
              <LoadMoreButton
                onClick={loadMore}
                loading={loading}
                hasMore={hasMore}
                totalCount={totalCount}
                currentCount={filteredDishes.length}
              />
            )}
          </section>

          <FloatingCartButton itemsCount={items.length} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
