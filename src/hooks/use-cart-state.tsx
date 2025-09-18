
import React, { useState, useEffect } from "react";
import { CartItem, DeliveryLocation, PaymentMethod, Order } from "@/contexts/CartContext";
import { useDeliveryZones } from "@/hooks/use-delivery-zones";
import { usePaymentMethods } from "@/hooks/use-payment-methods";

export const useCartState = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  // Use the delivery zones and payment methods hooks for real-time sync
  const { deliveryZones } = useDeliveryZones();
  const { paymentMethods } = usePaymentMethods();

  // Load data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cantinho-cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
      }
    }
    
    const savedOrders = localStorage.getItem("cantinho-orders");
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      }
    }
    
    const savedFavorites = localStorage.getItem("cantinho-favorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cantinho-cart", JSON.stringify(items));
  }, [items]);
  
  useEffect(() => {
    localStorage.setItem("cantinho-orders", JSON.stringify(orders));
  }, [orders]);
  
  useEffect(() => {
    localStorage.setItem("cantinho-favorites", JSON.stringify(favorites));
  }, [favorites]);

  return {
    items,
    setItems,
    selectedLocation,
    setSelectedLocation,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    orders,
    setOrders,
    favorites,
    setFavorites,
    deliveryLocations: deliveryZones,
    paymentMethods
  };
};
