
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { Order } from "@/hooks/admin/use-orders-data";
import { Order as CartOrder } from "@/contexts/CartContext";

export const useAdminState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<CartOrder | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const handleAuthentication = (isAdmin: boolean) => {
    setIsAuthenticated(isAdmin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setSelectedOrderId(null);
    setSelectedInvoiceOrder(null);
  };

  const handleSelectOrder = (orderId: string | null) => {
    setSelectedOrderId(orderId);
  };

  const handlePrepareInvoice = (order: CartOrder) => {
    setSelectedInvoiceOrder(order);
    setSelectedOrderId(null);
  };

  const handleBackFromInvoice = () => {
    setSelectedInvoiceOrder(null);
  };

  return {
    isAuthenticated,
    isLoading,
    selectedOrderId,
    selectedInvoiceOrder,
    activeTab,
    setActiveTab,
    handleAuthentication,
    handleLogout,
    handleSelectOrder,
    handlePrepareInvoice,
    handleBackFromInvoice
  };
};
