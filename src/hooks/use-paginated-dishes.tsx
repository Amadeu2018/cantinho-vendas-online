import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";
import { useFavorites } from "@/hooks/use-favorites";
import { buildDishQuery, executePaginatedQuery } from "@/hooks/dish/use-dish-queries";
import { formatDishFromProduct, mockDishes } from "@/utils/dish-helpers";

interface UsePaginatedDishesProps {
  pageSize?: number;
  searchTerm?: string;
  category?: string | null;
  featured?: boolean;
  popular?: boolean;
}

export const usePaginatedDishes = ({
  pageSize = 6,
  searchTerm = "",
  category = null,
  featured = false,
  popular = false
}: UsePaginatedDishesProps = {}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const { toggleFavorite, isFavorite } = useFavorites();

  const fetchDishes = async (pageNumber: number, reset: boolean = false) => {
    try {
      setLoading(true);
      
      const query = buildDishQuery({ searchTerm, category, featured, popular });
      const { data: products, error, count } = await executePaginatedQuery(query, pageNumber, pageSize);

      if (error) throw error;

      if (products) {
        const formattedDishes: Dish[] = products.map(formatDishFromProduct);

        if (reset) {
          setDishes(formattedDishes);
        } else {
          setDishes(prev => [...prev, ...formattedDishes]);
        }

        setTotalCount(count || 0);
        setHasMore(formattedDishes.length === pageSize && (pageNumber + 1) * pageSize < (count || 0));
      }
    } catch (error: any) {
      console.error('Erro ao buscar pratos:', error);
      
      // Fallback with mock data only for first page
      if (pageNumber === 0) {
        setDishes(mockDishes);
        setTotalCount(mockDishes.length);
        setHasMore(false);
      }
      
      toast({
        title: "Aviso",
        description: "Carregando dados locais dos pratos.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDishes(nextPage);
    }
  };

  const reset = () => {
    setPage(0);
    setDishes([]);
    setHasMore(true);
    fetchDishes(0, true);
  };

  useEffect(() => {
    reset();
  }, [searchTerm, category, featured, popular]);

  return {
    dishes,
    loading,
    hasMore,
    totalCount,
    loadMore,
    reset,
    isFavorite,
    toggleFavorite
  };
};