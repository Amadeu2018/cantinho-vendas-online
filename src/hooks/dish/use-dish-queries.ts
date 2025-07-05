import { supabase } from "@/integrations/supabase/client";
import { getCategoryFilter } from "@/utils/dish-helpers";

interface QueryFilters {
  searchTerm?: string;
  category?: string | null;
  featured?: boolean;
  popular?: boolean;
}

export const buildDishQuery = (filters: QueryFilters) => {
  let query = supabase
    .from('products')
    .select(`
      *,
      categories:categories!products_category_id_fkey(name),
      promotions:promotions!promotions_product_id_fkey(discount_percentage, start_date, end_date)
    `, { count: 'exact' });

  // Apply filters
  if (filters.searchTerm) {
    query = query.or(`name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }

  if (filters.category && filters.category !== "Todos") {
    const categoryFilters = getCategoryFilter(filters.category);
    // Use a single category filter to avoid complex OR conditions
    query = query.ilike('categories.name', `%${categoryFilters[0]}%`);
  }

  if (filters.featured) {
    query = query.gte('stock_quantity', 20);
  }

  if (filters.popular) {
    query = query.gte('stock_quantity', 15);
  }

  return query;
};

export const executePaginatedQuery = async (
  query: any,
  pageNumber: number,
  pageSize: number
) => {
  return await query
    .range(pageNumber * pageSize, (pageNumber + 1) * pageSize - 1)
    .order('created_at', { ascending: false });
};