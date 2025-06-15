
import { useEffect } from "react";
import { ProfileStats, RecentActivity } from "./profile/use-profile-stats";

interface UseProfileStatsProps {
  orders: any[];
  favorites: any[];
  setStats: (stats: ProfileStats) => void;
  setRecentActivities: (activities: RecentActivity[]) => void;
}

export const useProfileStats = ({ 
  orders, 
  favorites, 
  setStats, 
  setRecentActivities 
}: UseProfileStatsProps) => {
  
  useEffect(() => {
    const calculateStats = () => {
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => 
        ['pending', 'confirmed', 'preparing', 'delivering'].includes(order.status)
      ).length;
      const completedOrders = orders.filter(order => 
        order.status === 'completed'
      ).length;
      const favoriteCount = favorites.length;

      console.log("Calculando stats com todos os pedidos:", { 
        totalOrders, 
        pendingOrders, 
        completedOrders, 
        favoriteCount,
        ordersData: orders.map(o => ({ id: o.id, status: o.status }))
      });

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        favoriteCount
      });
    };

    const generateRecentActivities = () => {
      const activities: RecentActivity[] = [];

      console.log("Gerando atividades recentes com TODOS os", orders.length, "pedidos");

      orders.slice(0, 8).forEach(order => {
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
      
      const finalActivities = activities.slice(0, 8);
      console.log("Atividades recentes finais geradas:", finalActivities);
      
      setRecentActivities(finalActivities);
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

    console.log("Orders ou favorites mudaram, recalculando stats e atividades");
    console.log("Orders atuais:", orders.length, "Favorites:", favorites.length);
    
    if (orders.length > 0 || favorites.length > 0) {
      calculateStats();
      generateRecentActivities();
    } else if (orders.length === 0 && favorites.length === 0) {
      setRecentActivities([]);
      console.log("Nenhum pedido ou favorito encontrado, limpando atividades");
    }
  }, [orders, favorites, setStats, setRecentActivities]);
};

export { ProfileStats, RecentActivity } from "./profile/use-profile-stats";
