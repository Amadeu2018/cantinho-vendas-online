
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";

export interface ProfileData {
  email: string;
  phone: string;
  address_street: string;
  address_city: string;
  address_province: string;
  address_postal_code: string;
}

export interface ProfileStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  favoriteCount: number;
}

export interface RecentActivity {
  id: string;
  type: 'order' | 'favorite' | 'review';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  total?: number;
  itemsCount?: number;
}

export const useProfileData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData>({
    email: "",
    phone: "",
    address_street: "",
    address_city: "",
    address_province: "",
    address_postal_code: "",
  });
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<ProfileStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    favoriteCount: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      
      if (data) {
        setProfile({
          email: data.email || user.email || "",
          phone: data.phone || "",
          address_street: data.address_street || "",
          address_city: data.address_city || "",
          address_province: data.address_province || "",
          address_postal_code: data.address_postal_code || "",
        });
      } else {
        // Se não há perfil, usar dados do auth
        setProfile(prev => ({
          ...prev,
          email: user.email || ""
        }));
      }
    } catch (error: any) {
      console.error("Erro ao buscar perfil:", error);
      setProfile(prev => ({
        ...prev,
        email: user.email || ""
      }));
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("delivery_addresses")
        .select("*")
        .eq("profile_id", user.id);
      
      if (error) throw error;
      setAddresses(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar endereços:", error);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data: favoritesData, error: favoritesError } = await supabase
        .from("favorites")
        .select("dish_id")
        .eq("user_id", user.id);
      
      if (favoritesError) {
        console.error("Erro ao buscar favoritos:", favoritesError);
        return;
      }
      
      if (favoritesData && favoritesData.length > 0) {
        const dishIds = favoritesData.map(fav => fav.dish_id);
        
        const { data: dishesData, error: dishesError } = await supabase
          .from("products")
          .select("*")
          .in("id", dishIds);
        
        if (dishesError) {
          console.error("Erro ao buscar produtos dos favoritos:", dishesError);
          return;
        }
        
        const mappedDishes: Dish[] = (dishesData || []).map((product: any) => {
          let category: 'appetizer' | 'main' | 'dessert' = 'main';
          
          const name = (product.name || '').toLowerCase();
          const description = (product.description || '').toLowerCase();
          
          if (name.includes('entrada') || description.includes('entrada')) {
            category = 'appetizer';
          } else if (name.includes('sobremesa') || name.includes('doce') || description.includes('sobremesa')) {
            category = 'dessert';
          }
          
          return {
            id: product.id || '',
            name: product.name || 'Produto sem nome',
            description: product.description || '',
            price: Number(product.price) || 0,
            image_url: product.image_url || '/placeholder.svg',
            image: product.image_url || '/placeholder.svg',
            category,
            popular: false,
            tags: [],
          };
        });
        
        setFavorites(mappedDishes);
      }
    } catch (error: any) {
      console.error("Erro ao buscar favoritos:", error);
    }
  };

  const fetchOrders = async () => {
    if (!user) {
      console.log("Usuário não encontrado");
      return;
    }
    
    try {
      console.log("Buscando TODOS os pedidos para o usuário:", user.id);
      
      // Buscar TODOS os pedidos, não apenas os em andamento
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20); // Limitar para os 20 mais recentes
      
      if (error) {
        console.error("Erro na consulta de pedidos:", error);
        throw error;
      }
      
      console.log("Todos os pedidos encontrados:", data?.length || 0);
      console.log("Dados completos dos pedidos:", data);
      
      // Processar os dados dos pedidos
      const processedOrders = (data || []).map(order => {
        let processedItems = [];
        
        try {
          if (Array.isArray(order.items)) {
            processedItems = order.items;
          } else if (typeof order.items === 'string') {
            processedItems = JSON.parse(order.items);
          } else if (order.items && typeof order.items === 'object') {
            processedItems = [order.items];
          }
        } catch (e) {
          console.error("Erro ao processar items do pedido:", order.id, e);
          processedItems = [];
        }
        
        return {
          ...order,
          items: processedItems
        };
      });
      
      setOrders(processedOrders);
      console.log("Todos os pedidos processados e definidos:", processedOrders.length);
      
      // Log detalhado de cada pedido
      processedOrders.forEach((order, index) => {
        console.log(`Pedido ${index + 1}:`, {
          id: order.id,
          status: order.status,
          total: order.total,
          created_at: order.created_at,
          items_count: order.items?.length || 0
        });
      });
      
    } catch (error: any) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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

    // Add ALL recent orders (não apenas os pendentes)
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

    // Add recent favorites
    favorites.slice(0, 3).forEach((favorite, index) => {
      activities.push({
        id: `favorite-${favorite.id}`,
        type: 'favorite',
        title: 'Adicionado aos favoritos',
        description: favorite.name,
        timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString()
      });
    });

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const finalActivities = activities.slice(0, 8);
    console.log("Atividades recentes finais geradas:", finalActivities);
    console.log("Detalhes das atividades:", finalActivities.map(a => ({
      type: a.type,
      title: a.title,
      status: a.status,
      total: a.total
    })));
    
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

  useEffect(() => {
    if (user) {
      console.log("Usuário logado, carregando dados do perfil:", user.id);
      fetchProfile();
      fetchAddresses();
      fetchFavorites();
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    console.log("Orders ou favorites mudaram, recalculando stats e atividades");
    console.log("Orders atuais:", orders.length, "Favorites:", favorites.length);
    
    if (orders.length > 0 || favorites.length > 0) {
      calculateStats();
      generateRecentActivities();
    } else if (orders.length === 0 && favorites.length === 0) {
      // Garantir que as atividades sejam limpas se não houver dados
      setRecentActivities([]);
      console.log("Nenhum pedido ou favorito encontrado, limpando atividades");
    }
  }, [orders, favorites]);

  return {
    profile,
    setProfile,
    addresses,
    setAddresses,
    favorites,
    orders,
    stats,
    recentActivities,
    fetchProfile,
    fetchAddresses,
    fetchOrders
  };
};
