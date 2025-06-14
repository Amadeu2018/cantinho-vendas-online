
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  LogOut, 
  Settings, 
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import NotificationsDropdown from "./NotificationsDropdown";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const AdminLayout = ({ children, onLogout }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cantinho-navy to-cantinho-terracotta rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CA</span>
              </div>
              <div>
                <h1 className="font-bold text-xl text-cantinho-navy">Admin Panel</h1>
                <p className="text-xs text-gray-500">Cantinho Sabores de Angola</p>
              </div>
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

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-cantinho-terracotta text-white">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Administrador</p>
                <p className="text-xs text-gray-500">admin@cantinho.ao</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
