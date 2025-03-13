
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut, Settings, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState([]);

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
                          <div>Mostrar pedidos aqui</div>
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
                      <CardHeader>
                        <CardTitle>Meus Endereços</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-center py-4">
                          Funcionalidade em desenvolvimento
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="favoritos">
                    <Card>
                      <CardHeader>
                        <CardTitle>Meus Favoritos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-center py-4">
                          Funcionalidade em desenvolvimento
                        </p>
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
    </div>
  );
};

export default Profile;
