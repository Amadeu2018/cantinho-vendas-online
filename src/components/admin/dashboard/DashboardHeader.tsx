
import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Star, RefreshCw, CalendarPlus } from "lucide-react";

interface DashboardHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const DashboardHeader = ({ onRefresh, isRefreshing }: DashboardHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-cantinho-navy via-cantinho-terracotta to-cantinho-navy rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-4xl font-bold mb-3">Bem-vindo ao Dashboard! 🚀</h2>
            <p className="text-white/90 text-lg mb-4">Gerencie seu negócio com eficiência e estilo</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Crescimento constante</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                <Users className="w-4 h-4" />
                <span className="text-sm">Clientes satisfeitos</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">5 estrelas</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              variant="secondary" 
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button 
              variant="secondary"
              className="bg-white text-cantinho-navy hover:bg-white/90 transition-all duration-300 shadow-lg"
            >
              <CalendarPlus className="mr-2 h-4 w-4" /> Agendar Evento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
