
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminEventRequests from "@/components/admin/AdminEventRequests";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const EventAdmin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
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
    
    checkAdminStatus();
  }, [user, navigate, toast]);

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
          <h1 className="text-3xl font-bold mb-8 text-cantinho-navy">Administração de Eventos</h1>
          
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
