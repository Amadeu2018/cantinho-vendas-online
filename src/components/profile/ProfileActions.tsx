
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileData } from "./ProfileDataFetcher";

interface ProfileActionsProps {
  profile: ProfileData;
  setProfile: (profile: ProfileData) => void;
  addresses: any[];
  fetchAddresses: () => void;
}

export const useProfileActions = ({ profile, setProfile, addresses, fetchAddresses }: ProfileActionsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  return {
    loading,
    handleProfileUpdate,
    handleAddAddress
  };
};
