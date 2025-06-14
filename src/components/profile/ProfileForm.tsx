
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  profile: any;
  loading: boolean;
  onProfileChange: (profile: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onAddAddress: () => void;
}

const ProfileForm = ({ profile, loading, onProfileChange, onSubmit, onAddAddress }: ProfileFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => onProfileChange({...profile, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => onProfileChange({...profile, phone: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={profile.address_street}
                onChange={(e) => onProfileChange({...profile, address_street: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={profile.address_city}
                onChange={(e) => onProfileChange({...profile, address_city: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="province">Província</Label>
              <Input
                id="province"
                value={profile.address_province}
                onChange={(e) => onProfileChange({...profile, address_province: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="postal">Código Postal</Label>
              <Input
                id="postal"
                value={profile.address_postal_code}
                onChange={(e) => onProfileChange({...profile, address_postal_code: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Perfil"}
            </Button>
            <Button type="button" variant="outline" onClick={onAddAddress}>
              Adicionar como Endereço de Entrega
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
