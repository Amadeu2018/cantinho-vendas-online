import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, Settings, ShoppingBag, Plus, MapPin, Heart, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MenuCard from "@/components/menu/MenuCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Dish } from "@/types/dish";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [addressLoading, setAddressLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Dish[]>([]);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    postal_code: "",
    is_default: false
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });
          
        if (ordersError) throw ordersError;
        setOrders(ordersData || []);
        
        // Fetch addresses
        fetchAddresses();
        
        // Fetch favorites
        fetchFavorites();
        
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar suas informações",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const fetchAddresses = async () => {
    if (!user) return;
    
    try {
      setAddressLoading(true);
      const { data, error } = await supabase
        .from("delivery_addresses")
        .select("*")
        .eq("profile_id", user.id)
        .order("is_default", { ascending: false });
        
      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus endereços",
        variant: "destructive",
      });
    } finally {
      setAddressLoading(false);
    }
  };
  
  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      setFavoritesLoading(true);
      // Get favorite dish_ids
      const { data: favoritesData, error: favoritesError } = await supabase
        .from("favorites")
        .select("dish_id")
        .eq("user_id", user.id);
        
      if (favoritesError) throw favoritesError;
      
      if (favoritesData && favoritesData.length > 0) {
        // Get the actual dishes
        const dishIds = favoritesData.map(fav => fav.dish_id);
        const { data: dishes, error: dishesError } = await supabase
          .from("products")
          .select("*")
          .in("id", dishIds);
          
        if (dishesError) throw dishesError;
        setFavorites(dishes || []);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus favoritos",
        variant: "destructive",
      });
    } finally {
      setFavoritesLoading(false);
    }
  };
  
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      // If this is marked as default, update all other addresses to not be default
      if (addressForm.is_default) {
        await supabase
          .from("delivery_addresses")
          .update({ is_default: false })
          .eq("profile_id", user.id);
      }
      
      // Add the new address
      const { error } = await supabase
        .from("delivery_addresses")
        .insert({
          ...addressForm,
          profile_id: user.id
        });
        
      if (error) throw error;
      
      toast({
        title: "Endereço adicionado",
        description: "Seu endereço foi adicionado com sucesso",
      });
      
      // Reset form and close dialog
      setAddressForm({
        street: "",
        city: "",
        state: "",
        postal_code: "",
        is_default: false
      });
      setShowAddressForm(false);
      
      // Refresh addresses
      fetchAddresses();
      
    } catch (error) {
      console.error("Erro ao adicionar endereço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o endereço",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from("delivery_addresses")
        .delete()
        .eq("id", id)
        .eq("profile_id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Endereço removido",
        description: "Endereço removido com sucesso",
      });
      
      // Refresh addresses
      fetchAddresses();
      
    } catch (error) {
      console.error("Erro ao remover endereço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o endereço",
        variant: "destructive",
      });
    }
  };
  
  const setDefaultAddress = async (id: string) => {
    try {
      // Set all addresses to not default
      await supabase
        .from("delivery_addresses")
        .update({ is_default: false })
        .eq("profile_id", user.id);
        
      // Set this address as default
      const { error } = await supabase
        .from("delivery_addresses")
        .update({ is_default: true })
        .eq("id", id)
        .eq("profile_id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Endereço padrão atualizado",
        description: "Seu endereço padrão foi atualizado",
      });
      
      // Refresh addresses
      fetchAddresses();
      
    } catch (error) {
      console.error("Erro ao definir endereço padrão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível definir o endereço padrão",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveFavorite = async (dishId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("dish_id", dishId);
        
      if (error) throw error;
      
      toast({
        title: "Favorito removido",
        description: "Item removido dos favoritos com sucesso",
      });
      
      // Refresh favorites
      fetchFavorites();
      
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o item dos favoritos",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-cantinho-navy">Meu Perfil</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-cantinho-navy" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center mb-6">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarFallback className="text-xl">
                          {user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-semibold">
                        {user?.email}
                      </h2>
                      <p className="text-sm text-muted-foreground capitalize">
                        {profile?.role || "Cliente"}
                      </p>
                    </div>

                    <div className="space-y-4 mt-4">
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2"
                        onClick={() => navigate("/perfil/editar")}
                      >
                        <Settings className="h-4 w-4" />
                        Editar Perfil
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2 text-red-500 hover:text-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        Sair da Conta
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Tabs defaultValue="pedidos">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="pedidos">Meus Pedidos</TabsTrigger>
                    <TabsTrigger value="enderecos">Endereços</TabsTrigger>
                    <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pedidos" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pedidos Recentes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {orders && orders.length > 0 ? (
                          <div className="space-y-4">
                            {orders.map((order: any) => (
                              <Card key={order.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">Pedido #{order.id.substring(0, 8)}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(order.created_at).toLocaleString('pt-BR')}
                                      </p>
                                    </div>
                                    <Badge 
                                      className={
                                        order.status === 'completed' ? 'bg-green-500' : 
                                        order.status === 'cancelled' ? 'bg-red-500' : 
                                        'bg-yellow-500'
                                      }
                                    >
                                      {order.status === 'completed' ? 'Concluído' :
                                       order.status === 'cancelled' ? 'Cancelado' :
                                       order.status === 'pending' ? 'Pendente' :
                                       order.status === 'preparing' ? 'Em preparação' :
                                       order.status === 'delivering' ? 'Em entrega' :
                                       order.status}
                                    </Badge>
                                  </div>
                                  <div className="p-4">
                                    <p className="font-medium">Items: {order.items.length}</p>
                                    <p className="font-medium mt-2">Total: {(order.total).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</p>
                                    <Button 
                                      variant="outline" 
                                      className="mt-4"
                                      onClick={() => navigate(`/pedido/${order.id}`)}
                                    >
                                      Ver Detalhes
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">Nenhum pedido encontrado</h3>
                            <p className="text-muted-foreground mt-1">
                              Você ainda não fez nenhum pedido
                            </p>
                            <Button 
                              className="mt-4" 
                              onClick={() => navigate("/menu")}
                            >
                              Ver Menu
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="enderecos">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Meus Endereços</CardTitle>
                        <Button onClick={() => setShowAddressForm(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Adicionar Endereço
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {addressLoading ? (
                          <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : addresses.length > 0 ? (
                          <div className="space-y-4">
                            {addresses.map((address) => (
                              <Card key={address.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <MapPin className="h-5 w-5 mt-1 text-cantinho-navy" />
                                      <div>
                                        <p className="font-medium">{address.street}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {address.city}, {address.state} - {address.postal_code}
                                        </p>
                                        {address.is_default && (
                                          <Badge className="mt-2 bg-cantinho-navy">Endereço Padrão</Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {!address.is_default && (
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => setDefaultAddress(address.id)}
                                        >
                                          Definir como Padrão
                                        </Button>
                                      )}
                                      <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleDeleteAddress(address.id)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">Nenhum endereço cadastrado</h3>
                            <p className="text-muted-foreground mt-1">
                              Adicione endereços para facilitar suas compras
                            </p>
                            <Button 
                              className="mt-4" 
                              onClick={() => setShowAddressForm(true)}
                            >
                              Adicionar Endereço
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="favoritos">
                    <Card>
                      <CardHeader>
                        <CardTitle>Meus Favoritos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {favoritesLoading ? (
                          <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        ) : favorites.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {favorites.map((dish) => (
                              <MenuCard 
                                key={dish.id}
                                dish={dish}
                                isFavorite={true}
                                onToggleFavorite={() => handleRemoveFavorite(dish.id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">Nenhum favorito encontrado</h3>
                            <p className="text-muted-foreground mt-1">
                              Adicione pratos aos favoritos para encontrá-los facilmente
                            </p>
                            <Button 
                              className="mt-4" 
                              onClick={() => navigate("/menu")}
                            >
                              Explorar Menu
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Address Form Dialog */}
      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Endereço</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddressSubmit}>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="street">Rua</Label>
                <Input 
                  id="street" 
                  placeholder="Rua, número, complemento" 
                  required
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input 
                  id="city" 
                  placeholder="Cidade" 
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">Estado/Província</Label>
                  <Input 
                    id="state" 
                    placeholder="Estado" 
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="postal_code">Código Postal</Label>
                  <Input 
                    id="postal_code" 
                    placeholder="Código Postal" 
                    required
                    value={addressForm.postal_code}
                    onChange={(e) => setAddressForm({...addressForm, postal_code: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_default" 
                  checked={addressForm.is_default}
                  onCheckedChange={(checked) => 
                    setAddressForm({...addressForm, is_default: checked as boolean})
                  } 
                />
                <Label htmlFor="is_default">Definir como endereço padrão</Label>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={() => setShowAddressForm(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Endereço</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
