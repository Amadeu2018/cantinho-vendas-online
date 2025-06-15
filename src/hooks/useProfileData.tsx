
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

  const fetchOrders = async () => {
    if (!user) {
      console.log("Usuário não encontrado");
      return;
    }
    
    try {
      console.log("Buscando TODOS os pedidos para o usuário:", user.id);
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (error) {
        console.error("Erro na consulta de pedidos:", error);
        throw error;
      }
      
      console.log("Todos os pedidos encontrados:", data?.length || 0);
      
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
      
    } catch (error: any) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      console.log("Usuário logado, carregando dados do perfil:", user.id);
      fetchProfile();
      fetchAddresses();
      fetchOrders();
    }
  }, [user]);

  return {
    profile,
    setProfile,
    addresses,
    setAddresses,
    favorites,
    setFavorites,
    orders,
    stats,
    recentActivities,
    fetchProfile,
    fetchAddresses,
    fetchOrders
  };
};
