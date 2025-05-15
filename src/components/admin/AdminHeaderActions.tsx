
import React from "react";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "@/components/admin/NotificationsDropdown";
import NavEventButton from "@/components/admin/NavEventButton";
import AdminOrderNotifications from "@/components/admin/AdminOrderNotifications";
import { LogOut } from "lucide-react";

interface AdminHeaderActionsProps {
  onLogout: () => void;
}

const AdminHeaderActions = ({ onLogout }: AdminHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <AdminOrderNotifications />
      <NotificationsDropdown />
      <NavEventButton />
      <Button 
        variant="destructive" 
        size="sm"
        className="flex items-center gap-1 bg-red-600 hover:bg-red-700"
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4" />
        <span>Sair</span>
      </Button>
    </div>
  );
};

export default AdminHeaderActions;
