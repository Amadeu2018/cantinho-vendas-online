
import { useState, useEffect } from "react";

export const useFirstOrder = () => {
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  
  const discount = 0.1; // 10% discount

  useEffect(() => {
    const hasOrdered = localStorage.getItem("cantinho-has-ordered");
    const firstOrderApplied = localStorage.getItem("cantinho-first-order-applied");
    
    setIsFirstOrder(!hasOrdered);
    setDiscountApplied(!!firstOrderApplied);
  }, []);

  const applyFirstOrderDiscount = () => {
    if (isFirstOrder && !discountApplied) {
      setDiscountApplied(true);
      localStorage.setItem("cantinho-first-order-applied", "true");
      return true;
    }
    return false;
  };

  const calculateDiscount = (subtotal: number) => {
    if (isFirstOrder && discountApplied) {
      return subtotal * discount;
    }
    return 0;
  };

  const markAsOrdered = () => {
    localStorage.setItem("cantinho-has-ordered", "true");
    setIsFirstOrder(false);
  };

  return {
    isFirstOrder,
    discountApplied,
    discount,
    applyFirstOrderDiscount,
    calculateDiscount,
    markAsOrdered
  };
};
