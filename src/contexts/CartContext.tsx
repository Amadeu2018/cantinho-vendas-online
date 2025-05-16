
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
};

export type CustomerInfo = {
  name: string;
  address: string;
  phone: string;
  notes?: string;
};

export type DeliveryLocation = {
  id: string;
  name: string;
  fee: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  total: number;
  status: 'pending' | 'completed';
  paymentMethod: PaymentMethod;
  type: string;
  isProforma?: boolean;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  itemCount: (id: string) => number;
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  deliveryLocations: DeliveryLocation[];
  selectedLocation: DeliveryLocation | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<DeliveryLocation | null>>;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
  submitOrder: (customerInfo: CustomerInfo) => Promise<Order>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([
    { id: 'luanda', name: 'Luanda', fee: 500 },
    { id: 'talatona', name: 'Talatona', fee: 700 },
    { id: 'viana', name: 'Viana', fee: 900 },
    { id: 'benfica', name: 'Benfica', fee: 600 },
  ]);
  
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(deliveryLocations[0]);
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'cash', name: 'Dinheiro na Entrega', icon: 'cash' },
    { id: 'card', name: 'Cartão Multicaixa', icon: 'credit-card' },
    { id: 'transfer', name: 'Transferência Bancária', icon: 'bank' },
  ]);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(paymentMethods[0]);

  useEffect(() => {
    const loadCartFromLocalStorage = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from local storage', error);
          localStorage.removeItem('cart');
        }
      }
    };
    
    loadCartFromLocalStorage();
  }, []);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex((item) => item.id === newItem.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (newItem.quantity || 1)
        };
        return updatedItems;
      } else {
        return [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }];
      }
    });
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const itemCount = (id: string) => {
    return items.find((item) => item.id === id)?.quantity || 0;
  };

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const submitOrder = async (customerInfo: CustomerInfo): Promise<Order> => {
    // Calculate total including delivery fee
    const deliveryFee = selectedLocation?.fee || 0;
    const subtotal = totalPrice;
    const total = subtotal + deliveryFee;

    // Create order object
    const order: Order = {
      id: uuidv4(),
      items: [...items],
      customerInfo,
      total,
      status: 'pending',
      paymentMethod: selectedPaymentMethod || paymentMethods[0],
      type: 'Pedido'
    };

    try {
      // If user is authenticated, save order to database
      if (user) {
        const { error } = await supabase.from('orders').insert({
          id: order.id,
          customer_id: user.id,
          items: order.items,
          total: order.total,
          customer_info: order.customerInfo,
          payment_method: order.paymentMethod.id,
          status: order.status
        });

        if (error) throw error;
      }

      // Clear cart after successful order
      clearCart();
      
      return order;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
    itemCount,
    setItems,
    deliveryLocations,
    selectedLocation,
    setSelectedLocation,
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    submitOrder
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
