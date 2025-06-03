
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin, Heart, ShoppingBag, User, Mail, Phone, Trash2, Plus, Edit } from "lucide-react";
import { Dish } from "@/types/dish";
import { formatPrice } from '@/utils/formatter';

const Profile = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadProfile(),
        loadAddresses(),
        loadFavorites(),
        loadOrders()
      ]);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) {
      console.error("Erro ao carregar perfil:", error);
      return;
    }
    
    if (data) {
      setProfile(data);
    }
  };

  const loadAddresses = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('delivery_addresses')
      .select('*')
      .eq('profile_id', user.id)
      .order('is_default', { ascending: false });
      
    if (error) {
      console.error("Erro ao carregar endereços:", error);
      return;
    }
    
    if (data) {
      setAddresses(data);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;
    
    // Get user's favorite product IDs
    const { data: favoritesData, error: favoritesError } = await supabase
      .from('favorites')
      .select('dish_id')
      .eq('user_id', user.id);
      
    if (favoritesError) {
      console.error("Erro ao carregar favoritos:", favoritesError);
      return;
    }
    
    if (favoritesData && favoritesData.length > 0) {
      // Get product details for each favorite
      const dishIds = favoritesData.map(fav => fav.dish_id);
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', dishIds);
        
      if (productsError) {
        console.error("Erro ao carregar produtos favoritos:", productsError);
        return;
      }
      
      if (productsData) {
        // Convert products to Dish type
        const formattedFavorites: Dish[] = productsData.map(product => ({
          id: product.id,
          name: product.name,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          description: product.description || '',
          image_url: product.image_url || '/placeholder.svg',
          category: 'main' as const, // Default category
          tags: []
        }));
        
        setFavorites(formattedFavorites);
      }
    }
  };

  const loadOrders = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Erro ao carregar pedidos:", error);
      return;
    }
    
    if (data) {
      setOrders(data);
    }
  };

  const removeAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('delivery_addresses')
        .delete()
        .eq('id', addressId);
        
      if (error) throw error;
      
      setAddresses(addresses.filter(address => address.id !== addressId));
      
      toast({
        title: "Endereço removido",
        description: "O endereço foi removido com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao remover endereço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o endereço.",
        variant: "destructive"
      });
    }
  };

  const removeFavorite = async (dishId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('dish_id', dishId);
        
      if (error) throw error;
      
      setFavorites(favorites.filter(dish => dish.id !== dishId));
      
      toast({
        title: "Favorito removido",
        description: "O item foi removido dos seus favoritos.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o favorito.",
        variant: "destructive"
      });
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    try {
      // First, set all addresses to not default
      await supabase
        .from('delivery_addresses')
        .update({ is_default: false })
        .eq('profile_id', user?.id);
      
      // Then set the selected address as default
      const { error } = await supabase
        .from('delivery_addresses')
        .update({ is_default: true })
        .eq('id', addressId);
        
      if (error) throw error;
      
      // Update local state
      setAddresses(addresses.map(address => ({
        ...address,
        is_default: address.id === addressId
      })));
      
      toast({
        title: "Endereço padrão definido",
        description: "O endereço padrão foi atualizado com sucesso.",
        variant: "default"
      });
    } catch (error) {
      console.error("Erro ao definir endereço padrão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível definir o endereço padrão.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-cantinho-navy" />
            <p className="mt-2">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Faça login para acessar seu perfil</h1>
            <Button asChild>
              <a href="/auth/login">Entrar</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center text-white text-2xl font-semibold mr-4">
                  {profile?.company_name ? profile.company_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{profile?.company_name || 'Usuário'}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <Button variant="outline" className="ml-auto">
                  <Edit className="h-4 w-4 mr-2" /> Editar Perfil
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Nome</h3>
                    <p className="text-gray-600">{profile?.company_name || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-gray-600">{profile?.phone || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="addresses">
            <TabsList className="bg-white mb-6 border">
              <TabsTrigger value="addresses" className="data-[state=active]:bg-[#4f46e5] data-[state=active]:text-white">
                <MapPin className="h-4 w-4 mr-2" />
                Meus Endereços
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-[#4f46e5] data-[state=active]:text-white">
                <Heart className="h-4 w-4 mr-2" />
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-[#4f46e5] data-[state=active]:text-white">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Meus Pedidos
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="addresses">
              <div className="mb-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Novo Endereço
                </Button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <MapPin className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium mb-1">Nenhum endereço cadastrado</h3>
                  <p className="text-gray-600 mb-4">Adicione seu primeiro endereço para facilitar suas compras.</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Endereço
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <Card key={address.id} className={`overflow-hidden ${address.is_default ? 'border-[#4f46e5] border-2' : ''}`}>
                      <CardContent className="p-0">
                        <div className="p-4">
                          {address.is_default && (
                            <Badge className="mb-2 bg-[#4f46e5]">Endereço padrão</Badge>
                          )}
                          
                          <p className="text-gray-600 text-sm">{address.street}</p>
                          <p className="text-gray-600 text-sm">{address.city} - {address.state}</p>
                          <p className="text-gray-600 text-sm">CEP: {address.postal_code}</p>
                        </div>
                        
                        <div className="border-t p-2 flex justify-end space-x-2">
                          {!address.is_default && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setDefaultAddress(address.id)}
                            >
                              Tornar padrão
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-red-500 hover:text-white hover:bg-red-500"
                            onClick={() => removeAddress(address.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favorites">
              {favorites.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <Heart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium mb-1">Nenhum favorito encontrado</h3>
                  <p className="text-gray-600 mb-4">Adicione pratos aos seus favoritos para encontrá-los facilmente.</p>
                  <Button asChild>
                    <a href="/menu">Explorar Cardápio</a>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((dish) => (
                    <Card key={dish.id} className="overflow-hidden">
                      <div className="aspect-[16/9] bg-gray-100 relative">
                        <img 
                          src={dish.image_url || "/placeholder.svg"} 
                          alt={dish.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{dish.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold">
                            {formatPrice(dish.price)}
                          </span>
                          <div className="flex space-x-2">
                            <Button variant="outline" asChild>
                              <a href={`/menu?dish=${dish.id}`}>Ver detalhes</a>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="text-red-500 hover:text-white hover:bg-red-500"
                              onClick={() => removeFavorite(dish.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="orders">
              {orders.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium mb-1">Nenhum pedido encontrado</h3>
                  <p className="text-gray-600 mb-4">Você ainda não realizou nenhum pedido.</p>
                  <Button asChild>
                    <a href="/menu">Fazer Pedido</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Pedido #{order.id.substring(0, 8)}</h3>
                          <Badge className={
                            order.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                            'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                          }>
                            {order.status === 'completed' ? 'Concluído' :
                             order.status === 'processing' ? 'Em processamento' :
                             order.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                          <span>Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}</span>
                          <span>Total: {formatPrice(order.total)}</span>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Detalhes do Pedido
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
