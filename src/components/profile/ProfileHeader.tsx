
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
    <div className="bg-white rounded-lg shadow-sm border p-4 md:p-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden xs:inline">Voltar</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden xs:inline">Início</span>
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Meu Perfil</h1>
        </div>
        <div className="text-sm md:text-base text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Bem-vindo, {userEmail ? userEmail.split('@')[0] : 'usuário'}!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
