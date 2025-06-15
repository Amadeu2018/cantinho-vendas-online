
import { useMemo } from 'react';
import { RecentActivity } from '../useProfileData';

export const useRecentActivities = (orders: any[], favorites: any[]) => {
  return useMemo((): RecentActivity[] => {
    const activities: RecentActivity[] = [];

    console.log("Gerando atividades recentes com", orders.length, "pedidos");

    orders.slice(0, 10).forEach(order => {
      const items = order.items || [];
      
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        title: `Pedido #${order.id.slice(0, 8).toUpperCase()}`,
        description: `Status: ${getStatusDisplayName(order.status)}`,
        timestamp: order.created_at,
        status: order.status,
        total: Number(order.total) || 0,
        itemsCount: Array.isArray(items) ? items.length : 0
      });
    });

    favorites.slice(0, 3).forEach((favorite, index) => {
      activities.push({
        id: `favorite-${favorite.id}`,
        type: 'favorite',
        title: 'Adicionado aos favoritos',
        description: favorite.name,
        timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString()
      });
    });

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const finalActivities = activities.slice(0, 10);
    console.log("Atividades recentes finais:", finalActivities);
    
    return finalActivities;
  }, [orders, favorites]);
};

const getStatusDisplayName = (status: string) => {
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
