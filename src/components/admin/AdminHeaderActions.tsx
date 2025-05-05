
import React from "react";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "@/components/admin/NotificationsDropdown";
import NavEventButton from "@/components/admin/NavEventButton";
import AdminOrderNotifications from "@/components/admin/AdminOrderNotifications";

interface AdminHeaderActionsProps {
  onLogout: () => void;
}

const AdminHeaderActions = ({ onLogout }: AdminHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <AdminOrderNotifications />
      <NotificationsDropdown />
      <NavEventButton />
      <button 
        onClick={onLogout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm"
      >
        Sair
      </button>
    </div>
  );
};

export default AdminHeaderActions;
