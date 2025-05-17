
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PromotionsSection from "@/components/promotions/PromotionsSection";
import { useDishes } from "@/hooks/use-dishes";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMenuFilters } from "@/hooks/use-menu-filters";
import MenuHeader from "@/components/menu/MenuHeader";
import MenuFilters from "@/components/menu/MenuFilters";
import MenuTabs from "@/components/menu/MenuTabs";

const Menu = () => {
  const { dishes, loading, isFavorite, toggleFavorite } = useDishes();
  const isMobile = useIsMobile();
  const {
    searchTerm,
    setSearchTerm,
    priceFilter,
    setPriceFilter,
    filteredItems,
    clearFilters
  } = useMenuFilters(dishes);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <MenuHeader 
            title="Nosso Menu" 
            description="Descubra os melhores sabores da culinária portuguesa e angolana, preparados com ingredientes frescos e técnicas tradicionais."
          />

          <PromotionsSection />

          <div className="mt-12">
            <MenuFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              clearFilters={clearFilters}
            />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p>Carregando menu...</p>
            </div>
          ) : (
            <MenuTabs 
              isMobile={isMobile}
              filteredItems={filteredItems}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
