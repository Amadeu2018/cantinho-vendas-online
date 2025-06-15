
import { useState, useEffect, useCallback } from "react";
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
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
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
  }, [user]);

  const fetchAddresses = useCallback(async () => {
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
  }, [user]);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      console.log("Usuário não encontrado");
      return;
    }
    
    try {
      console.log("Buscando TODOS os pedidos mais recentes para o usuário:", user.id);
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50); // Aumentar limite para garantir que pegamos todos os recentes
      
      if (error) {
        console.error("Erro na consulta de pedidos:", error);
        throw error;
      }
      
      console.log("Pedidos encontrados:", data?.length || 0);
      
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
      console.log("Pedidos processados e definidos:", processedOrders.length);
      
    } catch (error: any) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const fetchFavorites = useCallback(async () => {
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
  }, [user]);

  const calculateStats = useCallback(() => {
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

    setStats({
      totalOrders,
      pendingOrders,
      completedOrders,
      favoriteCount
    });
  }, [orders, favorites]);

  const generateRecentActivities = useCallback(() => {
    const activities: RecentActivity[] = [];

    console.log("Gerando atividades recentes com", orders.length, "pedidos");

    // Pegar os 10 pedidos mais recentes
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

    // Adicionar favoritos
    favorites.slice(0, 3).forEach((favorite, index) => {
      activities.push({
        id: `favorite-${favorite.id}`,
        type: 'favorite',
        title: 'Adicionado aos favoritos',
        description: favorite.name,
        timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString()
      });
    });

    // Ordenar por timestamp (mais recente primeiro)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const finalActivities = activities.slice(0, 10);
    console.log("Atividades recentes finais:", finalActivities);
    
    setRecentActivities(finalActivities);
  }, [orders, favorites]);

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

  // Fetch inicial dos dados
  useEffect(() => {
    if (user) {
      console.log("Usuário logado, carregando dados do perfil:", user.id);
      setLoading(true);
      
      Promise.all([
        fetchProfile(),
        fetchAddresses(),
        fetchOrders(),
        fetchFavorites()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [user, fetchProfile, fetchAddresses, fetchOrders, fetchFavorites]);

  // Calcular stats quando orders ou favorites mudarem
  useEffect(() => {
    if (orders.length > 0 || favorites.length > 0) {
      calculateStats();
      generateRecentActivities();
    }
  }, [orders, favorites, calculateStats, generateRecentActivities]);

  return {
    profile,
    setProfile,
    addresses,
    setAddresses,
    favorites,
    setFavorites,
    orders,
    setOrders,
    stats,
    recentActivities,
    loading,
    fetchProfile,
    fetchAddresses,
    fetchOrders,
    fetchFavorites
  };
};
