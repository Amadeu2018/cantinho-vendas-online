
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface ProfileInfo {
  name: string;
  phone: string;
  address: string;
}

const ProfileSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: "",
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    if (user) {
      fetchProfileInfo();
    }
  }, [user]);

  const fetchProfileInfo = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileInfo({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address_street || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar informações de perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas informações de perfil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        name: profileInfo.name,
        phone: profileInfo.phone,
        address_street: profileInfo.address,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
        variant: "default",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Informações Pessoais</h3>
        {!isEditing && (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            Editar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <div className="flex items-center gap-2">
            <Input value={user?.email || ""} readOnly disabled />
            <Badge variant="outline">Verificado</Badge>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nome Completo</label>
          <Input
            name="name"
            value={profileInfo.name}
            onChange={handleChange}
            readOnly={!isEditing}
            disabled={!isEditing || isLoading}
            className={isEditing ? "" : "bg-gray-50"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <Input
            name="phone"
            value={profileInfo.phone}
            onChange={handleChange}
            readOnly={!isEditing}
            disabled={!isEditing || isLoading}
            className={isEditing ? "" : "bg-gray-50"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <Input
            name="address"
            value={profileInfo.address}
            onChange={handleChange}
            readOnly={!isEditing}
            disabled={!isEditing || isLoading}
            className={isEditing ? "" : "bg-gray-50"}
          />
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-cantinho-navy hover:bg-cantinho-navy/90"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                fetchProfileInfo();
              }}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
