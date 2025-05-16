
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

type CartItemProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

const CartItem = ({ id, name, price, quantity, image }: CartItemProps) => {
  const { updateQuantity, removeItem } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === quantity) return;
    
    setIsUpdating(true);
    setTimeout(() => {
      updateQuantity(id, newQuantity);
      setIsUpdating(false);
    }, 150);
  };
  
  const handleRemove = () => {
    setIsUpdating(true);
    setTimeout(() => {
      removeItem(id);
    }, 150);
  };
  
  return (
    <div className={`flex flex-col sm:flex-row border-b py-4 last:border-b-0 last:pb-0 transition-opacity duration-200 ${isUpdating ? 'opacity-60' : 'opacity-100'}`}>
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 sm:ml-4 flex flex-col">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">{name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-500 transition-colors"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-cantinho-navy font-medium">
          {formatCurrency(price)}
        </div>
        <div className="flex items-center mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full transition-all hover:bg-cantinho-terracotta/10"
            onClick={() => handleUpdateQuantity(quantity - 1)}
            disabled={isUpdating}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="mx-3 font-medium min-w-[20px] text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full transition-all hover:bg-cantinho-terracotta/10"
            onClick={() => handleUpdateQuantity(quantity + 1)}
            disabled={isUpdating}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <div className="ml-auto font-semibold">
            {formatCurrency(price * quantity)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
