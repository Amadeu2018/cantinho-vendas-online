
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ProfileData {
  id: string;
  company_name?: string;
  email?: string;
  phone?: string;
  nif?: string;
  role?: string;
  created_at?: string;
}

export const useProfileData = (userId?: string) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    if (userId) {
      fetchProfile();
    }
  };

  return { profile, loading, refreshProfile };
};
