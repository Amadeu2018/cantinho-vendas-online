
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
  image_url?: string;
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed';

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
  estimatedTime?: string;
};

export type Order = {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  total: number;
  subtotal: number;
  deliveryFee: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  type: string;
  createdAt: string;
  location: DeliveryLocation;
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
  subtotal: number;
  itemCount: (id: string) => number;
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  deliveryLocations: DeliveryLocation[];
  selectedLocation: DeliveryLocation | null;
  setSelectedLocation: React.Dispatch<React.SetStateAction<DeliveryLocation | null>>;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod | null>>;
  submitOrder: (customerInfo: CustomerInfo) => Promise<string>;
  getOrderById: (orderId: string) => Promise<Order | null>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  
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
  const subtotal = totalPrice;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const submitOrder = async (customerInfo: CustomerInfo): Promise<string> => {
    // Calculate total including delivery fee
    const deliveryFee = selectedLocation?.fee || 0;
    const subtotalAmount = totalPrice;
    const total = subtotalAmount + deliveryFee;

    // Create order ID
    const orderId = uuidv4();

    // Create order object
    const order: Order = {
      id: orderId,
      items: [...items],
      customerInfo,
      subtotal: subtotalAmount,
      deliveryFee,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: selectedPaymentMethod || paymentMethods[0],
      type: 'Pedido',
      createdAt: new Date().toISOString(),
      location: selectedLocation || deliveryLocations[0]
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
          status: order.status,
          payment_status: order.paymentStatus,
          created_at: order.createdAt,
          subtotal: order.subtotal,
          delivery_fee: order.deliveryFee,
          location: order.location
        });

        if (error) {
          console.error("Error submitting order to Supabase:", error);
          throw error;
        }
      }

      // Save order to local storage for anonymous users or as a backup
      const savedOrders = localStorage.getItem('orders');
      const orders = savedOrders ? JSON.parse(savedOrders) : [];
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Clear cart after successful order
      clearCart();
      
      return orderId;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      // Try to get order from Supabase if user is authenticated
      if (user) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
        
        if (!error && data) {
          // Transform database order into app Order type
          return {
            id: data.id,
            items: data.items as CartItem[] || [],
            customerInfo: data.customer_info as CustomerInfo || {},
            total: data.total,
            subtotal: data.subtotal || 0,
            deliveryFee: data.delivery_fee || 0,
            status: data.status as OrderStatus,
            paymentStatus: data.payment_status as PaymentStatus,
            paymentMethod: {
              id: data.payment_method || 'unknown',
              name: data.payment_method || 'Método de Pagamento',
              icon: 'credit-card'
            },
            type: data.type || 'Pedido',
            createdAt: data.created_at || new Date().toISOString(),
            location: data.location || deliveryLocations[0]
          };
        }
      }
      
      // Fallback to local storage
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const order = orders.find((o: any) => o.id === orderId);
        if (order) {
          return order as Order;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
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
