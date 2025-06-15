import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProfileForm from "@/components/profile/ProfileForm";
import AddressesList from "@/components/profile/AddressesList";
import FavoritesList from "@/components/profile/FavoritesList";
import OrdersHistory from "@/components/profile/OrdersHistory";
import OrderTracking from "@/components/profile/OrderTracking";
import ProfileStats from "@/components/profile/ProfileStats";
import RecentActivity from "@/components/profile/RecentActivity";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    favoriteCount: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Get default tab from URL params
  const defaultTab = searchParams.get('tab') || 'overview';

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
    const activities: any[] = [];

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-1" />
              Início
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
        </div>
        <div className="text-sm text-gray-600">
          Bem-vindo de volta, {profile.email ? profile.email.split('@')[0] : 'usuário'}!
        </div>
      </div>
      
      <ProfileStats {...stats} />

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="tracking">Acompanhar</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="addresses">Endereços</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="orders">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity activities={recentActivities} />
            <OrderTracking userId={user.id} />
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <OrderTracking userId={user.id} />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileForm
            profile={profile}
            loading={loading}
            onProfileChange={setProfile}
            onSubmit={handleProfileUpdate}
            onAddAddress={handleAddAddress}
          />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressesList addresses={addresses} />
        </TabsContent>

        <TabsContent value="favorites">
          <FavoritesList favorites={favorites} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersHistory orders={orders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
