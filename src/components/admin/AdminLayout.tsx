
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./layout/AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  title?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminLayout = ({ 
  children, 
  onLogout, 
  title = "Dashboard", 
  activeTab = "dashboard",
  onTabChange 
}: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminSidebar 
          activeTab={activeTab}
          onTabChange={onTabChange || (() => {})}
          onLogout={onLogout || (() => {})}
        />
        <SidebarInset className="flex-1 w-full">
          <AdminHeader
            onLogout={onLogout}
            title={title}
          />
          <main className="p-3 sm:p-4 lg:p-6 flex-1 min-h-screen">
            <div className="max-w-full">
              <div className="animate-fade-in">
                {children}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
