
import { Dish } from './dish';

export type Promotion = {
  id: string;
  title: string;
  description: string;
  discount: number;
  validUntil: string;
  image_url: string;
  dish: Dish;
  isActive: boolean;
};
