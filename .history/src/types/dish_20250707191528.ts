export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image: string;
  category: string;
  tags: string[];
  popular: boolean;
  promotion?: {
    discount: number;
    label?: string;
  };
  rating: number;
  prepTime: string;
  serves: number;
  isSpicy: boolean;
  isVegetarian: boolean;
  isPopular: boolean;
};

// Defina um tipo para o produto
type Product = {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    categories?: { name: string }[];
    stock_quantity: number;
    promotions?: { discount_percentage: number }[];
};

// Atualize a função para usar o tipo Product
export const formatDishFromProduct = (product: Product): Dish => ({
    id: product.id,
    name: product.name || 'Produto sem nome',
    description: product.description || 'Descrição não disponível',
    price: Number(product.price) || 0,
    image_url: product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
    image: product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
    category: mapCategory(product.categories?.[0]?.name || 'main'), // Ajuste para pegar a primeira categoria
    popular: product.stock_quantity > 10,
    tags: product.categories ? [product.categories[0].name] : [],
    promotion: product.promotions && product.promotions.length > 0 ? {
        discount: Number(product.promotions[0].discount_percentage) || 0,
        label: `${product.promotions[0].discount_percentage}% OFF`
    } : undefined,
    rating: 4.5,
    prepTime: '20-30 min',
    serves: 2,
    isSpicy: false,
    isVegetarian: false,
    isPopular: product.stock_quantity > 10
});
