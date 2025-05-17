
import { useState, useEffect } from 'react';
import { CartItem } from '@/types/cart';

export const useCartOperations = () => {
  const [items, setItems] = useState<CartItem[]>([]);

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

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
    subtotal,
    totalItems
  };
};
