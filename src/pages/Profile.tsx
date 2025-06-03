
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dish } from "@/types/dish";
import MenuCard from "@/components/menu/MenuCard";

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
        
        // Map products to Dish format
        const mappedDishes: Dish[] = (dishesData || []).map((product: any) => {
          let category: 'appetizer' | 'main' | 'dessert' = 'main';
          
          // Simple category mapping based on name or description
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
      
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  value={profile.address_street}
                  onChange={(e) => setProfile({...profile, address_street: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={profile.address_city}
                  onChange={(e) => setProfile({...profile, address_city: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province">Província</Label>
                <Input
                  id="province"
                  value={profile.address_province}
                  onChange={(e) => setProfile({...profile, address_province: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="postal">Código Postal</Label>
                <Input
                  id="postal"
                  value={profile.address_postal_code}
                  onChange={(e) => setProfile({...profile, address_postal_code: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Perfil"}
              </Button>
              <Button type="button" variant="outline" onClick={handleAddAddress}>
                Adicionar como Endereço de Entrega
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Delivery Addresses */}
      <Card>
        <CardHeader>
          <CardTitle>Endereços de Entrega</CardTitle>
        </CardHeader>
        <CardContent>
          {addresses.length > 0 ? (
            <div className="space-y-2">
              {addresses.map((address) => (
                <div key={address.id} className="p-3 border rounded">
                  <p className="font-medium">
                    {address.street}, {address.city}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.state}, {address.postal_code}
                  </p>
                  {address.is_default && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Padrão
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhum endereço cadastrado</p>
          )}
        </CardContent>
      </Card>

      {/* Favorites */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Favoritos</CardTitle>
        </CardHeader>
        <CardContent>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((dish) => (
                <MenuCard 
                  key={dish.id} 
                  dish={dish} 
                  isFavorite={true}
                  onToggleFavorite={fetchFavorites}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Você ainda não tem pratos favoritos</p>
          )}
        </CardContent>
      </Card>

      {/* Orders History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Pedido #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Intl.NumberFormat("pt-AO", {
                          style: "currency",
                          currency: "AOA",
                        }).format(order.total)}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{order.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Você ainda não fez nenhum pedido</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
