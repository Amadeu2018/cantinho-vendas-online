
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div>
        <h1 className="text-2xl font-bold text-cantinho-navy">Painel Administrativo</h1>
        <p className="text-gray-600 mt-1">Gerencie seu restaurante de forma eficiente</p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onLogout}
        className="flex items-center gap-2 border-cantinho-navy text-cantinho-navy hover:bg-cantinho-navy hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  );
};

export default DashboardHeader;
