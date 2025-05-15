
import React from "react";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "@/components/admin/NotificationsDropdown";
import NavEventButton from "@/components/admin/NavEventButton";
import AdminOrderNotifications from "@/components/admin/AdminOrderNotifications";
import { LogOut, User, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AdminHeaderActionsProps {
  onLogout: () => void;
}

const AdminHeaderActions = ({ onLogout }: AdminHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <AdminOrderNotifications />
      <NotificationsDropdown />
      <NavEventButton />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cantinho-navy to-cantinho-cornflower flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden md:inline-block">Admin</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="border-b bg-gray-50">
            <div className="text-xs font-medium text-gray-500">Logado como</div>
            <div className="text-sm font-medium text-gray-800">Admin</div>
          </DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer">
            <User className="h-4 w-4 mr-2" /> Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AdminHeaderActions;
