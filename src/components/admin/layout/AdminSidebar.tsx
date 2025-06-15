
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AdminSidebarNavigation from "./AdminSidebarNavigation";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

const AdminSidebar = ({ sidebarOpen, onCloseSidebar, activeTab, onTabChange }: AdminSidebarProps) => {
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-cantinho-navy to-cantinho-navy/90 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 bg-cantinho-navy/20 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-cantinho-terracotta to-cantinho-sand rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CA</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">Cantinho Admin</h1>
            <p className="text-xs text-white/70">Painel de Controle</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:bg-white/10"
          onClick={onCloseSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <AdminSidebarNavigation 
        activeTab={activeTab}
        onTabChange={onTabChange}
        onItemClick={onCloseSidebar}
      />

      {/* Quick Stats in Sidebar */}
      <div className="absolute bottom-4 left-3 right-3">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold text-sm mb-3">Status Rápido</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-white/80">
              <span>Pedidos Hoje</span>
              <span className="font-semibold text-cantinho-sand">23</span>
            </div>
            <div className="flex justify-between text-white/80">
              <span>Online</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-400">Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
