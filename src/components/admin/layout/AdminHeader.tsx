
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Search, Home, Bell, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import NotificationsDropdown from "../NotificationsDropdown";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminHeaderProps {
  onLogout?: () => void;
  title: string;
}

const AdminHeader = ({ onLogout, title }: AdminHeaderProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        {/* Left section - Mobile optimized */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <SidebarTrigger className="h-8 w-8 sm:h-10 sm:w-10 hover:bg-gray-100 rounded-lg transition-colors" />
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <Link 
              to="/" 
              className="hidden sm:flex items-center gap-2 text-cantinho-navy hover:text-cantinho-terracotta transition-colors text-sm whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-cantinho-terracotta/10"
            >
              <Home className="h-4 w-4" />
              <span>Voltar ao Site</span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <h1 className="font-bold text-lg sm:text-xl text-cantinho-navy truncate">{title}</h1>
          </div>
        </div>

        {/* Center section - Search */}
        {!isMobile && (
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pedidos, clientes..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cantinho-terracotta focus:bg-white transition-all"
              />
            </div>
          </div>
        )}

        {/* Right section - Mobile optimized */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="h-8 w-8 hover:bg-gray-100"
            >
              {isSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </Button>
          )}

          {/* Mobile back to site button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 hover:bg-gray-100"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {/* Notifications */}
          <div className="relative">
            <NotificationsDropdown />
          </div>

          {/* User Menu - Compact on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200">
            <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-cantinho-terracotta/20">
              <AvatarFallback className="bg-cantinho-terracotta text-white text-xs font-medium">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900">Administrador</p>
              <p className="text-xs text-gray-500">admin@cantinho.ao</p>
            </div>
            {onLogout && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 sm:h-10 sm:w-10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {isMobile && isSearchOpen && (
        <div className="px-3 pb-3 animate-slide-in-top">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos, clientes..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cantinho-terracotta focus:bg-white transition-all"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
