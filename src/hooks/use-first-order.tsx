
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

export const useFirstOrder = () => {
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const { items } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a first order (no previous orders in localStorage)
    const hasOrderedBefore = localStorage.getItem('has_ordered_before');
    setIsFirstOrder(!hasOrderedBefore);
  }, []);

  const applyFirstOrderDiscount = () => {
    if (isFirstOrder && items.length > 0 && !discountApplied) {
      setDiscountApplied(true);
      toast({
        title: "Desconto aplicado!",
        description: "10% de desconto no seu primeiro pedido foi aplicado. Use o código: PRIMEIRO10",
      });
      return true;
    }
    return false;
  };

  const calculateDiscount = (subtotal: number) => {
    if (isFirstOrder && discountApplied) {
      return subtotal * 0.1; // 10% discount
    }
    return 0;
  };

  const markAsOrdered = () => {
    localStorage.setItem('has_ordered_before', 'true');
    setIsFirstOrder(false);
    setDiscountApplied(false);
  };

  return {
    isFirstOrder,
    discountApplied,
    applyFirstOrderDiscount,
    calculateDiscount,
    markAsOrdered
  };
};
