
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";

interface DashboardHeaderProps {
  onLogout: () => void;
}

const DashboardHeader = ({ onLogout }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 gap-4 sm:gap-0">
      <div className="w-full sm:w-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-cantinho-navy">Painel Administrativo</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Gerencie seu restaurante de forma eficiente</p>
      </div>
      
      <Button 
        variant="outline" 
        onClick={onLogout}
        className="flex items-center gap-2 border-cantinho-navy text-cantinho-navy hover:bg-cantinho-navy hover:text-white w-full sm:w-auto justify-center h-10 sm:h-auto text-sm sm:text-base"
      >
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;
