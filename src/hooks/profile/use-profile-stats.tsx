
import { useMemo } from 'react';

export interface ProfileStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  favoriteCount: number;
}

export const useProfileStats = (orders: any[], favorites: any[]) => {
  return useMemo((): ProfileStats => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'delivering'].includes(order.status)
    ).length;
    const completedOrders = orders.filter(order => 
      order.status === 'completed'
    ).length;
    const favoriteCount = favorites.length;

    console.log("Calculando stats:", { 
      totalOrders, 
      pendingOrders, 
      completedOrders, 
      favoriteCount 
    });

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      favoriteCount
    };
  }, [orders, favorites]);
};
