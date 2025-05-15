
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  title?: string;
}

const AdminLayout = ({ children, isLoading = false, title = "Área Administrativa" }: AdminLayoutProps) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-10">
          <div className="container mx-auto px-4 flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2 text-cantinho-navy" />
            <p className="text-cantinho-navy">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-cantinho-navy border-b pb-4">{title}</h1>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
