
import React from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AdminAuthenticationProps {
  onAuthenticated: (isAdmin: boolean) => void;
}

const AdminAuthentication = ({ onAuthenticated }: AdminAuthenticationProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkAdminStatus = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data && data.role === 'admin') {
        return true;
      } else {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissões de administrador.",
          variant: "destructive"
        });
        navigate('/');
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar perfil:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar suas permissões.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleLogin = async (isAdmin: boolean) => {
    const hasAdminAccess = await checkAdminStatus();
    onAuthenticated(hasAdminAccess);
    return hasAdminAccess;
  };

  return <AdminLogin onLogin={handleLogin} />;
};

export default AdminAuthentication;
