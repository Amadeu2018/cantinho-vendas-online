
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from '@/lib/utils';

interface MobileCartSummaryProps {
  onCheckout?: () => void;
}

const MobileCartSummary = ({ onCheckout }: MobileCartSummaryProps) => {
  const { items, totalPrice } = useCart();
  
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Carrinho ({items.length} items)</h3>
        <span className="font-semibold">{formatCurrency(totalPrice)}</span>
      </div>
      
      <div className="max-h-28 overflow-y-auto mb-3">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="text-sm py-1 flex justify-between">
            <span className="truncate flex-1">{item.quantity}× {item.name}</span>
            <span className="font-medium ml-2">{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        
        {items.length > 3 && (
          <div className="text-sm text-gray-500 italic">
            +{items.length - 3} mais itens...
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Link to="/carrinho" className="flex-1" onClick={onCheckout}>
          <Button variant="outline" size="sm" className="w-full">
            Ver Carrinho
          </Button>
        </Link>
        
        <Link to="/carrinho?checkout=true" className="flex-1" onClick={onCheckout}>
          <Button size="sm" className="w-full bg-cantinho-navy hover:bg-cantinho-navy/90">
            <ShoppingBag className="h-4 w-4 mr-1" />
            Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileCartSummary;
