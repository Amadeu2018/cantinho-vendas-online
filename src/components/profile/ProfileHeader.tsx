
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  userEmail: string;
}

const ProfileHeader = ({ userEmail }: ProfileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4 mr-1" />
            Início
          </Button>
        </div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
      </div>
      <div className="text-sm text-gray-600">
        Bem-vindo de volta, {userEmail ? userEmail.split('@')[0] : 'usuário'}!
      </div>
    </div>
  );
};

export default ProfileHeader;
