
import { Dish } from './dish';

export type Promotion = {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  validUntil: string;
  image_url: string;
  dishes: Dish[];
};
