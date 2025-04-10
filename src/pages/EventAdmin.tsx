
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminEventRequests from "@/components/admin/AdminEventRequests";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import EventRequestStats from "@/components/admin/EventRequestStats";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EventAdmin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Habilitar realtime no supabase para a tabela event_requests
    const enableRealtime = async () => {
      await supabase
        .channel('event-requests-realtime')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'event_requests' 
        }, payload => {
          console.log('Evento em tempo real recebido:', payload);
        })
        .subscribe();
    };

    enableRealtime();
    checkAdminStatus();

    return () => {
      // Limpar canal ao desmontar componente
      supabase.removeChannel(supabase.channel('event-requests-realtime'));
    };
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsLoading(false);
      navigate('/auth/login');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data.role === 'admin') {
        setIsLoading(false);
      } else {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissões de administrador.",
          variant: "destructive"
        });
        navigate('/');
      }
    } catch (error) {
      console.error("Erro ao verificar perfil:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar suas permissões.",
        variant: "destructive"
      });
      setIsLoading(false);
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="container mx-auto px-4 flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-cantinho-navy">Administração de Eventos</h1>
            <Button variant="outline" asChild>
              <Link to="/admin">
                Voltar para Admin Principal
              </Link>
            </Button>
          </div>
          
          <EventRequestStats />
          
          <div className="space-y-6">
            <AdminEventRequests />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventAdmin;
