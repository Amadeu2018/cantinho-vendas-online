
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Search, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationsDropdown from "../NotificationsDropdown";

interface AdminHeaderProps {
  onLogout?: () => void;
  title: string;
}

const AdminHeader = ({ onLogout, title }: AdminHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-cantinho-navy hover:text-cantinho-terracotta transition-colors">
              <Home className="h-4 w-4" />
              <span className="text-sm">Voltar ao Site</span>
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <h1 className="font-bold text-xl text-cantinho-navy">{title}</h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar pedidos, clientes..."
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-cantinho-terracotta text-white text-xs">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-xs text-gray-500">admin@cantinho.ao</p>
            </div>
            {onLogout && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
