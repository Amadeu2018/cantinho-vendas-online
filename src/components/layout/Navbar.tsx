
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const { user } = useAuth();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation links
  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Eventos", path: "/eventos" },
    { name: "Sobre", path: "/sobre" },
    { name: "Reservas", path: "/reservas" }
  ];

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white shadow-sm py-2"
          : "bg-white/80 backdrop-blur-md py-3"
      )}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-cantinho-navy mr-2">
            Cantinho<span className="text-cantinho-terracotta">Algarvio</span>
          </h1>
          <span className="hidden md:block text-xs bg-cantinho-terracotta text-white px-2 py-0.5 rounded-md font-medium">
            Luanda
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {user && navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(link.path)
                  ? "text-cantinho-terracotta"
                  : "text-gray-700 hover:text-cantinho-terracotta hover:bg-gray-100"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-2">
          <Link to="/carrinho">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-cantinho-terracotta">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Link to={user ? "/profile" : "/auth/login"}>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 px-0">
                <div className="flex flex-col h-full pt-8">
                  <div className="px-6 pb-6 border-b">
                    <h3 className="font-bold text-xl mb-1 text-cantinho-navy">
                      Cantinho Algarvio
                    </h3>
                    <p className="text-sm text-gray-500">Luanda, Angola</p>
                  </div>

                  <nav className="flex-1 py-4">
                    <div className="px-3 space-y-1">
                      {user && navLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={cn(
                            "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            isActive(link.path)
                              ? "bg-cantinho-navy/10 text-cantinho-navy"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </div>
                  </nav>

                  <div className="px-6 py-4 border-t mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        to="/carrinho"
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" /> Carrinho
                        {itemCount > 0 && (
                          <Badge className="ml-2 bg-cantinho-terracotta">
                            {itemCount}
                          </Badge>
                        )}
                      </Link>
                    </div>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                    >
                      <Link to={user ? "/profile" : "/auth/login"}>
                        <User className="h-4 w-4 mr-2" />
                        {user ? "Meu Perfil" : "Entrar / Registrar"}
                      </Link>
                    </Button>
                    
                    {user?.role === 'admin' && (
                      <Button
                        asChild
                        variant="default"
                        className="w-full mt-2 bg-cantinho-navy hover:bg-cantinho-navy/90"
                      >
                        <Link to="/admin">
                          Área Administrativa
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
