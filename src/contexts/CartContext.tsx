import React, { createContext, useState, useContext, useEffect } from 'react';

// Types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: {
    id: string;
    name: string;
    icon: string;
  };
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string;
  notes: string;
  type?: string; // Add type property to Order interface
  location: {
    id: number;
    name: string;
    fee: number;
    estimatedTime: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  itemCount: number;
  order: Order | null;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  updateItemNotes: (id: string, notes: string) => void;
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];

    const storedItems = localStorage.getItem('cartItems');
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    const existingItemIndex = items.findIndex((i) => i.id === item.id);

    if (existingItemIndex !== -1) {
      const newItems = [...items];
      newItems[existingItemIndex].quantity += item.quantity;
      setItems(newItems);
    } else {
      setItems([...items, item]);
    }
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const updateItemNotes = (id: string, notes: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, notes: notes } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    // Generate a unique ID for the order
    const id = Math.random().toString(36).substring(2, 15);
    const createdAt = new Date().toISOString();

    const newOrder: Order = {
      id,
      items: items,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      total: total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: {
        id: 'default-payment-method',
        name: 'Default Payment',
        icon: 'credit-card',
      },
      customerInfo: {
        name: 'Customer Name',
        address: 'Customer Address',
        phone: 'Customer Phone',
      },
      createdAt: createdAt,
      notes: '',
	  type: 'Pedido',
      location: {
        id: 1,
        name: 'Default Location',
        fee: 5,
        estimatedTime: '30-45 min',
      },
      ...orderData,
    };

    setOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    // This is a placeholder, replace with actual data fetching logic
    return new Promise((resolve) => {
      setTimeout(() => {
        if (order && order.id === orderId) {
          resolve(order);
        } else {
          resolve(null);
        }
      }, 500);
    });
  };

  const value: CartContextType = {
    items,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    subtotal,
    total,
    deliveryFee,
    setDeliveryFee,
    itemCount,
    order,
    createOrder,
    getOrderById,
    updateItemNotes,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
