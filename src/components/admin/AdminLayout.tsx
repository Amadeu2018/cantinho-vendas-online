
import React, { useState } from "react";
import AdminSidebar from "./layout/AdminSidebar";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex">
      <AdminSidebar 
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onLogout={onLogout}
          title={title}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
