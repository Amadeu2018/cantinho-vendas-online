import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('dish_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(fav => fav.dish_id) || []);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    }
  };

  const toggleFavorite = async (dishId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para adicionar favoritos",
          variant: "destructive",
        });
        return;
      }

      const isFavorite = favorites.includes(dishId);

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('dish_id', dishId);

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== dishId));
        toast({
          title: "Removido dos favoritos",
          description: "Prato removido da sua lista de favoritos",
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, dish_id: dishId });

        if (error) throw error;

        setFavorites(prev => [...prev, dishId]);
        toast({
          title: "Adicionado aos favoritos",
          description: "Prato adicionado à sua lista de favoritos",
        });
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o favorito",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (dishId: string) => favorites.includes(dishId);

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite
  };
};