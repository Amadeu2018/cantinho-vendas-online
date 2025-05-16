
import React, { useEffect } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AdminAuthenticationProps {
  onAuthenticated: (isAdmin: boolean) => void;
}

const AdminAuthentication = ({ onAuthenticated }: AdminAuthenticationProps) => {
  const { user, checkAdminStatus } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      verifyAdminAccess();
    }
  }, [user]);

  const verifyAdminAccess = async () => {
    const isAdmin = await checkAdminStatus();
    
    if (isAdmin) {
      onAuthenticated(true);
    } else {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissões de administrador.",
        variant: "destructive"
      });
      navigate('/');
    }
  };

  const handleLogin = async () => {
    const isAdmin = await checkAdminStatus();
    onAuthenticated(isAdmin);
    return isAdmin;
  };

  return <AdminLogin onLogin={handleLogin} />;
};

export default AdminAuthentication;
