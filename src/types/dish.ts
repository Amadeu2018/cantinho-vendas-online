export type SaleUnit = 'unit' | 'kg' | 'combo' | 'rodizio';

export type MeatDoneness = 'mal passada' | 'ao ponto' | 'bem passada';

export type GrillCustomization = {
  id: string;
  product_id: string;
  meat_doneness: MeatDoneness[];
  available_marinades: string[];
  side_dishes: string[];
};

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image: string;
  category: string;
  categoryName?: string;
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
  productType?: 'food' | 'grill' | 'beverage';
  // Novos campos para churrascaria
  sale_unit?: SaleUnit;
  prep_time_minutes?: number;
  meat_options?: MeatDoneness[];
  spice_level?: number;
  is_grill_product?: boolean;
  combo_serves?: number;
  grill_customizations?: GrillCustomization;
};
