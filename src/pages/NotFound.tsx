
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-6xl font-bold text-cantinho-terracotta mb-4">404</h1>
          <p className="text-xl text-gray-700 mb-6">Oops! Página não encontrada</p>
          <p className="text-gray-600 mb-8">
            A página que está a procurar pode ter sido removida, alterada ou está temporariamente indisponível.
          </p>
          <Button asChild className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90">
            <Link to="/">Voltar ao Início</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
