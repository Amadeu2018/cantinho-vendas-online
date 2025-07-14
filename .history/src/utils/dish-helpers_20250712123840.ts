import { Dish } from "@/types/dish";

export const mapCategory = (categoryName: string): 'appetizer' | 'main' | 'dessert' => {
  const lowerCategory = categoryName.toLowerCase();
  if (lowerCategory.includes('entrada') || lowerCategory.includes('aperitivo')) return 'appetizer';
  if (lowerCategory.includes('sobremesa') || lowerCategory.includes('doce')) return 'dessert';
  return 'main';
};

export const getCategoryFilter = (category: string): string[] => {
  const categoryMap: { [key: string]: string[] } = {
    'Entradas': ['Entradas', 'Aperitivos'],
    'Peixes e Frutos do Mar': ['Peixes', 'Frutos do Mar', 'Pescado'],
    'Carnes': ['Carnes', 'Carne'],
    'Pratos Vegetarianos': ['Vegetariano', 'Vegano', 'Vegetais'],
    'Massas': ['Massas', 'Pasta'],
    'Sobremesas': ['Sobremesas', 'Doces'],
    'Bebidas': ['Bebidas', 'Drinks'],
    'Vinhos': ['Vinhos', 'Vinho'],
    'Pratos Tradicionais': ['Tradicionais', 'Tradicional', 'Pratos Principais']
  };
  return categoryMap[category] || [category];
};

export const mockDishes: Dish[] = [
  {
    id: "1",
    name: "Bacalhau à Brás",
    description: "Tradicional prato português com bacalhau desfiado, batata palha e ovos.",
    price: 2500,
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
    category: "main",
    tags: ["peixe", "tradicional"],
    popular: true,
    promotion: { discount: 15 },
    rating: 4.8,
    prepTime: '25-30 min',
    serves: 2,
    isSpicy: false,
    isVegetarian: false,
    isPopular: true
  },
  {
    id: "2",
    name: "Francesinha",
    description: "Sanduíche português com linguiça, presunto, carne e molho especial.",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3",
    category: "main",
    tags: ["carne", "tradicional"],
    popular: true,
    rating: 4.6,
    prepTime: '20-25 min',
    serves: 1,
    isSpicy: false,
    isVegetarian: false,
    isPopular: true
  },
];

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
  // Novos campos para churrascaria
  sale_unit?: string;
  prep_time_minutes?: number;
  meat_options?: string[]; // Assuming meat_options is an array of strings
  spice_level?: number;
  is_grill_product?: boolean;
  combo_serves?: number;
};

// Atualize a função para usar o tipo Product
export const formatDishFromProduct = (product: Product): Dish => {
  const categoryName = product.categories && product.categories.length > 0 ? product.categories[0].name : 'Outros';
  
  // Determine product type based on category
  const getProductType = (category: string): 'food' | 'grill' | 'beverage' => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('churrasco') || lowerCategory.includes('grill') || lowerCategory.includes('carne') || 
        lowerCategory.includes('bovinas') || lowerCategory.includes('suínas') || lowerCategory.includes('frango') ||
        lowerCategory.includes('peixe') || lowerCategory.includes('espetadas') || lowerCategory.includes('combo')) return 'grill';
    if (lowerCategory.includes('bebida') || lowerCategory.includes('vinho') || lowerCategory.includes('drink')) return 'beverage';
    return 'food';
  };

  // Parse meat options from JSONB
  const parseMeatOptions = (meatOptions: string | string[]): string[] => {
    if (Array.isArray(meatOptions)) return meatOptions;
    if (typeof meatOptions === 'string') {
      try {
        return JSON.parse(meatOptions);
      } catch {
        return [];
      }
    }
    return [];
  };

  return {
    id: product.id,
    name: product.name || 'Produto sem nome',
    description: product.description || 'Descrição não disponível',
    price: Number(product.price) || 0,
    image_url: product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
    image: product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
    category: categoryName,
    categoryName: categoryName,
    popular: product.stock_quantity > 10,
    tags: product.categories && product.categories.length > 0 ? [product.categories[0].name] : [],
    promotion: product.promotions && product.promotions.length > 0 ? {
      discount: Number(product.promotions[0].discount_percentage) || 0,
      label: `${product.promotions[0].discount_percentage}% OFF`
    } : undefined,
    rating: 4.5,
    prepTime: product.prep_time_minutes ? `${product.prep_time_minutes} min` : '20-30 min',
    serves: product.combo_serves || 2,
    isSpicy: (product.spice_level || 0) > 2,
    isVegetarian: false,
    isPopular: product.stock_quantity > 10,
    productType: getProductType(categoryName),
    // Novos campos para churrascaria
    sale_unit: product.sale_unit as any,
    prep_time_minutes: product.prep_time_minutes,
    meat_options: parseMeatOptions(product.meat_options),
    spice_level: product.spice_level,
    is_grill_product: product.is_grill_product,
    combo_serves: product.combo_serves
  };
};


/*export const formatDishFromProduct = (product: any): Dish => ({
  id: product.id,
  name: product.name || 'Produto sem nome',
  description: product.description || 'Descrição não disponível',
  price: Number(product.price) || 0,
  image_url: product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
  image: product.image_url || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3',
  category: mapCategory(product.categories?.name || 'main'),
  popular: product.stock_quantity > 10,
  tags: product.categories ? [product.categories.name] : [],
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
});*/