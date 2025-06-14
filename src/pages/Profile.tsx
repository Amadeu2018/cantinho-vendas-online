import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";
import ProfileForm from "@/components/profile/ProfileForm";
import AddressesList from "@/components/profile/AddressesList";
import FavoritesList from "@/components/profile/FavoritesList";
import OrdersHistory from "@/components/profile/OrdersHistory";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
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
      toast({
        title: "Erro ao carregar endereços",
        description: error.message,
        variant: "destructive",
      });
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
      toast({
        title: "Erro ao carregar favoritos",
        description: error.message,
        variant: "destructive",
      });
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
    } catch (error: any) {
      console.error("Erro ao buscar pedidos:", error);
      toast({
        title: "Erro ao carregar pedidos",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: profile.email,
          phone: profile.phone,
          address_street: profile.address_street,
          address_city: profile.address_city,
          address_province: profile.address_province,
          address_postal_code: profile.address_postal_code,
        });
      
      if (error) throw error;
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("delivery_addresses")
        .insert({
          profile_id: user.id,
          street: profile.address_street,
          city: profile.address_city,
          state: profile.address_province,
          postal_code: profile.address_postal_code,
          country: "Angola",
          is_default: addresses.length === 0,
        });
      
      if (error) throw error;
      
      await fetchAddresses();
      toast({
        title: "Endereço adicionado",
        description: "Novo endereço de entrega foi adicionado",
      });
    } catch (error: any) {
      console.error("Erro ao adicionar endereço:", error);
      toast({
        title: "Erro ao adicionar endereço",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Você precisa estar logado para ver seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>
      
      <ProfileForm
        profile={profile}
        loading={loading}
        onProfileChange={setProfile}
        onSubmit={handleProfileUpdate}
        onAddAddress={handleAddAddress}
      />

      <AddressesList addresses={addresses} />

      <FavoritesList favorites={favorites} />

      <OrdersHistory orders={orders} />
    </div>
  );
};

export default Profile;
