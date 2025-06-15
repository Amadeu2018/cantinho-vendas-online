
import React, { useState } from "react";
import { Star, Clock, Users } from "lucide-react";
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
          <MenuHero />
          
          <MenuFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
          />

          {featuredDishes.length > 0 && (
            <MenuSection
              title="Pratos em Destaque"
              description="Nossos pratos mais premiados e apreciados pelos clientes"
              icon={<Star className="h-8 w-8 text-cantinho-terracotta" />}
              dishes={featuredDishes}
            />
          )}

          {popularDishes.length > 0 && (
            <MenuSection
              title="Mais Pedidos"
              description="Os favoritos dos nossos clientes mais exigentes"
              icon={<Users className="h-8 w-8 text-cantinho-terracotta" />}
              dishes={popularDishes}
            />
          )}

          <MenuSection
            title="Todos os Pratos"
            description="Explore toda nossa carta de sabores únicos e autênticos"
            icon={<Clock className="h-8 w-8 text-cantinho-terracotta" />}
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
