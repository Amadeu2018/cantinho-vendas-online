
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MenuCard from "@/components/menu/MenuCard";
import { Dish } from "@/types/dish";

interface FavoritesListProps {
  favorites: Dish[];
}

const FavoritesList = ({ favorites }: FavoritesListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Favoritos</CardTitle>
      </CardHeader>
      <CardContent>
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((dish) => (
              <MenuCard 
                key={dish.id} 
                dish={dish} 
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Você ainda não tem pratos favoritos</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoritesList;
