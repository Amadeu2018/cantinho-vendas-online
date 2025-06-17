
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "react-router-dom";
import OrderTrackingList from "./tracking/OrderTrackingList";
import OrderTrackingDetail from "./tracking/OrderTrackingDetail";

interface OrderTrackingProps {
  orders: any[];
}

const OrderTracking = ({ orders }: OrderTrackingProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Check if there's a track parameter in URL
  const trackOrderId = searchParams.get('track');
  
  useEffect(() => {
    if (trackOrderId && orders.length > 0) {
      const orderToTrack = orders.find(order => order.id.includes(trackOrderId));
      if (orderToTrack) {
        setSelectedOrder(orderToTrack);
      }
    }
  }, [trackOrderId, orders]);

  const handleSelectOrder = (order: any) => {
    setSelectedOrder(order);
    // Update URL to reflect selected order
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('track', order.id.slice(0, 8));
      return newParams;
    });
  };

  const handleBackToList = () => {
    setSelectedOrder(null);
    // Remove track parameter from URL
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('track');
      return newParams;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusName = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Aguardando Confirmação",
      confirmed: "Confirmado",
      preparing: "Em Preparação",
      delivering: "Em Entrega",
      completed: "Entregue",
      cancelled: "Cancelado"
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'preparing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivering':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending':
        return 20;
      case 'confirmed':
        return 40;
      case 'preparing':
        return 60;
      case 'delivering':
        return 80;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  // Filter orders that are trackable (not completed or cancelled)
  const trackableOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'delivering'].includes(order.status)
  );

  if (selectedOrder) {
    return (
      <Card className="w-full">
        <OrderTrackingDetail
          order={selectedOrder}
          onBack={handleBackToList}
          formatPrice={formatPrice}
          getStatusName={getStatusName}
          getStatusColor={getStatusColor}
          getProgressPercentage={getProgressPercentage}
        />
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">📦</span>
          Acompanhar Pedidos
        </h2>
        <OrderTrackingList
          orders={trackableOrders}
          onSelectOrder={handleSelectOrder}
          formatPrice={formatPrice}
          getStatusName={getStatusName}
          getStatusColor={getStatusColor}
          getProgressPercentage={getProgressPercentage}
        />
      </div>
    </Card>
  );
};

export default OrderTracking;
