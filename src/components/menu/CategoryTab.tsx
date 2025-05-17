
import React from "react";
import { Tag } from "lucide-react";
import MenuCard from "@/components/menu/MenuCard";
import { Dish } from "@/types/dish";

type CategoryTabProps = {
  dishes: Dish[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const CategoryTab: React.FC<CategoryTabProps> = ({ dishes, isFavorite, toggleFavorite }) => {
  if (dishes.length > 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.map(dish => (
          <MenuCard 
            key={dish.id}
            dish={dish}
            isFavorite={isFavorite(dish.id)}
            onToggleFavorite={() => toggleFavorite(dish.id)}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="text-center py-12">
      <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-xl font-medium text-gray-700">Nenhum prato encontrado</h3>
      <p className="text-gray-500 mt-2">Tente alterar seus filtros de busca</p>
    </div>
  );
};

export default CategoryTab;
