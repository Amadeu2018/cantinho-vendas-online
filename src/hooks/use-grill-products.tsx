import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";
import { formatDishFromProduct } from "@/utils/dish-helpers";

interface UseGrillProductsProps {
  category?: string | null;
  searchTerm?: string;
}

export const useGrillProducts = ({ category, searchTerm }: UseGrillProductsProps = {}) => {
  const [grillProducts, setGrillProducts] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchGrillProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select(`
          *,
          categories:categories!products_category_id_fkey(name),
          promotions:promotions!promotions_product_id_fkey(discount_percentage, start_date, end_date),
          grill_customizations:grill_customizations!grill_customizations_product_id_fkey(*)
        `)
        .eq('is_grill_product', true);

      // Filtrar por categoria se especificada
      if (category && category !== "Todos") {
        const grillCategories = [
          'Carnes Bovinas', 'Carnes Suínas', 'Carnes de Frango', 'Carnes de Peixe',
          'Acompanhamentos Grill', 'Bebidas Grill', 'Combos Churrascaria', 'Espetadas'
        ];
        
        if (grillCategories.includes(category)) {
          query = query.eq('categories.name', category);
        }
      }

      // Filtrar por termo de busca se especificado
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data: products, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      if (products) {
        const formattedDishes: Dish[] = products.map((product: any) => {
          const dish = formatDishFromProduct(product);
          
          // Adicionar customizações se existirem
          if (product.grill_customizations && product.grill_customizations.length > 0) {
            dish.grill_customizations = product.grill_customizations[0];
          }
          
          return dish;
        });

        setGrillProducts(formattedDishes);
      }
    } catch (error: any) {
      console.error('Erro ao buscar produtos da churrascaria:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos da churrascaria",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrillProducts();
  }, [category, searchTerm]);

  return {
    grillProducts,
    loading,
    refetch: fetchGrillProducts
  };
};