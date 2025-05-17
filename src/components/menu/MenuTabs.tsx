
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryTab from "@/components/menu/CategoryTab";
import { Dish } from "@/types/dish";

type MenuTabsProps = {
  isMobile: boolean;
  filteredItems: {
    appetizer: Dish[];
    main: Dish[];
    dessert: Dish[];
  };
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const MenuTabs: React.FC<MenuTabsProps> = ({
  isMobile,
  filteredItems,
  isFavorite,
  toggleFavorite,
}) => {
  return (
    <Tabs defaultValue="main" className="w-full">
      <TabsList className={`w-full flex justify-center mb-8 ${isMobile ? 'overflow-x-auto no-scrollbar' : ''}`}>
        <TabsTrigger value="appetizer" className="px-6">Entradas</TabsTrigger>
        <TabsTrigger value="main" className="px-6">Pratos Principais</TabsTrigger>
        <TabsTrigger value="dessert" className="px-6">Sobremesas</TabsTrigger>
      </TabsList>
      
      <TabsContent value="appetizer">
        <CategoryTab 
          dishes={filteredItems.appetizer} 
          isFavorite={isFavorite} 
          toggleFavorite={toggleFavorite} 
        />
      </TabsContent>
      
      <TabsContent value="main">
        <CategoryTab 
          dishes={filteredItems.main} 
          isFavorite={isFavorite} 
          toggleFavorite={toggleFavorite} 
        />
      </TabsContent>
      
      <TabsContent value="dessert">
        <CategoryTab 
          dishes={filteredItems.dessert} 
          isFavorite={isFavorite} 
          toggleFavorite={toggleFavorite} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default MenuTabs;
