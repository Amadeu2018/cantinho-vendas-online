
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Search, Home, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationsDropdown from "../NotificationsDropdown";

interface AdminHeaderProps {
  onLogout?: () => void;
  title: string;
}

const AdminHeader = ({ onLogout, title }: AdminHeaderProps) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Left section - Mobile optimized */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <SidebarTrigger className="h-8 w-8 sm:h-10 sm:w-10" />
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link 
              to="/" 
              className="hidden sm:flex items-center gap-2 text-cantinho-navy hover:text-cantinho-terracotta transition-colors text-sm whitespace-nowrap"
            >
              <Home className="h-4 w-4" />
              <span>Voltar ao Site</span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <h1 className="font-bold text-lg sm:text-xl text-cantinho-navy truncate">{title}</h1>
          </div>
        </div>

        {/* Right section - Mobile optimized */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search - Hidden on mobile, visible on tablets+ */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-2 w-48 lg:w-64">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <NotificationsDropdown />
          </div>

          {/* User Menu - Compact on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
              <AvatarFallback className="bg-cantinho-terracotta text-white text-xs">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-xs text-gray-500">admin@cantinho.ao</p>
            </div>
            {onLogout && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-10 sm:w-10"
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
