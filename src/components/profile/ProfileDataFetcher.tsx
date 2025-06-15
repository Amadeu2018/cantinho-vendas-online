
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ProfileStats, useProfileStats } from "@/hooks/profile/use-profile-stats";
import { RecentActivity, useRecentActivities } from "@/hooks/profile/use-recent-activities";

export interface ProfileData {
  id: string;
  company_name?: string;
  email?: string;
  phone?: string;
  nif?: string;
  role?: string;
  created_at?: string;
  address_street?: string;
  address_city?: string;
  address_province?: string;
  address_postal_code?: string;
}

export const useProfileDataFetcher = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({ id: user?.id || "" });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const stats = useProfileStats(orders, favorites);
  const recentActivities = useRecentActivities(orders, favorites);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAddresses();
      fetchFavorites();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("delivery_addresses")
        .select("*")
        .eq("profile_id", user.id)
        .order("is_default", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          dish_id,
          created_at,
          products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;
      
      const favoritesWithProducts = (data || []).map(fav => ({
        id: fav.id,
        dish_id: fav.dish_id,
        created_at: fav.created_at,
        name: fav.products?.name || 'Produto não encontrado',
        price: fav.products?.price || 0,
        image_url: fav.products?.image_url
      }));
      
      setFavorites(favoritesWithProducts);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
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
      setOrders(data || []);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    }
  };

  return {
    profile,
    setProfile,
    addresses,
    setAddresses,
    favorites,
    orders,
    stats,
    recentActivities,
    loading,
    fetchProfile,
    fetchAddresses,
    fetchOrders
  };
};
