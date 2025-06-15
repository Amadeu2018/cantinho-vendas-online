
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
          email: data.email || "",
          phone: data.phone || "",
          address_street: data.address_street || "",
          address_city: data.address_city || "",
          address_province: data.address_province || "",
          address_postal_code: data.address_postal_code || "",
        });
      }
    } catch (error: any) {
      console.error("Erro ao buscar perfil:", error);
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
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
      
      if (favoritesError) throw favoritesError;
      
      if (favoritesData && favoritesData.length > 0) {
        const dishIds = favoritesData.map(fav => fav.dish_id);
        
        const { data: dishesData, error: dishesError } = await supabase
          .from("products")
          .select("*")
          .in("id", dishIds);
        
        if (dishesError) throw dishesError;
        
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
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      console.log("Orders fetched:", data);
      setOrders(data || []);
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

    setStats({
      totalOrders,
      pendingOrders,
      completedOrders,
      favoriteCount
    });
  };

  const generateRecentActivities = () => {
    const activities: RecentActivity[] = [];

    // Add recent orders with more details
    orders.slice(0, 4).forEach(order => {
      const items = Array.isArray(order.items) ? order.items : 
                   typeof order.items === 'string' ? JSON.parse(order.items) : [];
      
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        title: `Pedido #${order.id.slice(0, 8).toUpperCase()}`,
        description: `Status: ${getStatusDisplayName(order.status)}`,
        timestamp: order.created_at,
        status: order.status,
        total: order.total,
        itemsCount: items.length
      });
    });

    // Add recent favorites
    favorites.slice(0, 2).forEach((favorite, index) => {
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
    
    setRecentActivities(activities.slice(0, 6));
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
      fetchProfile();
      fetchAddresses();
      fetchFavorites();
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    if (orders.length > 0 || favorites.length > 0) {
      calculateStats();
      generateRecentActivities();
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
