
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";
import { useProfileStats } from "./profile/use-profile-stats";
import { useRecentActivities } from "./profile/use-recent-activities";

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
  const [loading, setLoading] = useState(true);

  // Use custom hooks for calculations
  const stats = useProfileStats(orders, favorites);
  const recentActivities = useRecentActivities(orders, favorites);

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
      console.log("Buscando pedidos pelo email:", user.email);
      
      // Buscar pedidos pelo email do usuário em customer_info
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .contains("customer_info", { email: user.email })
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Erro na consulta de pedidos:", error);
        throw error;
      }
      
      console.log("Pedidos encontrados pelo email:", data?.length || 0);
      
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
      } else {
        setFavorites([]);
      }
    } catch (error: any) {
      console.error("Erro ao buscar favoritos:", error);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      console.log("Usuário logado, carregando dados do perfil:", user.email);
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

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log("Configurando subscriptions em tempo real para:", user.email);

    const ordersChannel = supabase
      .channel(`profile-orders-${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders'
        }, 
        (payload) => {
          console.log('Order change detected:', payload);
          // Verificar se o pedido pertence ao usuário atual
          const orderData = payload.new as any;
          if (orderData && orderData.customer_info) {
            // Fixed: properly check if customer_info contains user email
            let customerEmail = '';
            try {
              if (typeof orderData.customer_info === 'string') {
                const info = JSON.parse(orderData.customer_info);
                customerEmail = info.email || '';
              } else if (orderData.customer_info && typeof orderData.customer_info === 'object') {
                customerEmail = orderData.customer_info.email || '';
              }
            } catch (e) {
              console.error('Error parsing customer_info:', e);
            }
            
            if (customerEmail === user.email) {
              fetchOrders();
            }
          }
        }
      )
      .subscribe();

    const favoritesChannel = supabase
      .channel(`profile-favorites-${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'favorites',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Favorites change detected for user:', payload);
          fetchFavorites();
        }
      )
      .subscribe();

    return () => {
      console.log("Limpando subscriptions");
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(favoritesChannel);
    };
  }, [user, fetchOrders, fetchFavorites]);

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
