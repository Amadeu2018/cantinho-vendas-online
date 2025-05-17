
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useCartOperations } from '@/hooks/useCartOperations';
import { submitOrder as submitOrderService, getOrderById as getOrderByIdService } from '@/services/orderService';
import type { CartContextType, CustomerInfo, DeliveryLocation, PaymentMethod, Order } from '@/types/cart';

export type { CartItem, OrderStatus, PaymentStatus, PaymentMethod, CustomerInfo, DeliveryLocation, Order } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { 
    items, setItems, addItem, removeItem, updateQuantity, 
    clearCart, itemCount, totalPrice, subtotal, totalItems 
  } = useCartOperations();
  
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([
    { id: 'luanda', name: 'Luanda', fee: 500, estimatedTime: '30-45 min' },
    { id: 'talatona', name: 'Talatona', fee: 700, estimatedTime: '45-60 min' },
    { id: 'viana', name: 'Viana', fee: 900, estimatedTime: '50-70 min' },
    { id: 'benfica', name: 'Benfica', fee: 600, estimatedTime: '40-55 min' },
  ]);
  
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(deliveryLocations[0]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'cash', name: 'Dinheiro na Entrega', icon: 'cash' },
    { id: 'card', name: 'Cartão Multicaixa', icon: 'credit-card' },
    { id: 'transfer', name: 'Transferência Bancária', icon: 'bank' },
  ]);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(paymentMethods[0]);

  const submitOrder = async (customerInfo: CustomerInfo): Promise<string> => {
    if (!selectedLocation || !selectedPaymentMethod) {
      throw new Error('Location or payment method not selected');
    }
    
    const orderId = await submitOrderService(
      items, 
      customerInfo, 
      selectedLocation, 
      selectedPaymentMethod, 
      user?.id
    );
    
    // Clear cart after successful order
    clearCart();
    
    return orderId;
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    return await getOrderByIdService(orderId, user?.id);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    subtotal,
    totalItems,
    itemCount,
    setItems,
    deliveryLocations,
    selectedLocation,
    setSelectedLocation,
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    submitOrder,
    getOrderById
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
