
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ProfileFormData {
  company_name?: string;
  email?: string;
  phone?: string;
  nif?: string;
}

export const useProfileForm = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateProfile = async (data: ProfileFormData) => {
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, loading };
};
