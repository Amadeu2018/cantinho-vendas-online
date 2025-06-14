
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, Settings, Gift, Phone, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import NavEventButton from "../admin/NavEventButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleFirstOrder = () => {
    navigate('/primeiro-pedido');
    setIsMenuOpen(false);
  };

  const handlePremiumCatering = () => {
    navigate('/eventos?package=premium');
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-cantinho-terracotta/10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and brand name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-cantinho-terracotta font-bold text-lg">C</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cantinho-terracotta to-cantinho-navy bg-clip-text text-transparent">
                Cantinho Algarvio
              </span>
              <div className="flex items-center gap-1 -mt-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500">Premium Delivery</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Início</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/menu" className="text-foreground hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Menu</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/eventos" className="text-foreground hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Eventos</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/sobre" className="text-foreground hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Sobre Nós</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/contacto" className="text-foreground hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Contacto</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            
            {/* Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleFirstOrder}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Gift className="w-4 h-4 mr-1" />
                Primeiro Pedido
              </Button>
              
              <Button
                onClick={handlePremiumCatering}
                size="sm"
                variant="outline"
                className="border-cantinho-terracotta text-cantinho-terracotta hover:bg-cantinho-terracotta hover:text-white transition-all duration-300"
              >
                Catering Premium
              </Button>
            </div>

            <Link to="/carrinho">
              <Button variant="ghost" size="icon" className="relative hover:bg-cantinho-cream transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-cantinho-terracotta text-white h-6 w-6 flex items-center justify-center p-0 text-xs animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-cantinho-cream transition-colors">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white/95 backdrop-blur-md shadow-xl border-cantinho-terracotta/20">
                  <div className="flex items-center justify-start p-3 bg-gradient-to-r from-cantinho-cream to-white">
                    <div className="bg-cantinho-terracotta text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cantinho-navy">{user.email}</p>
                      <p className="text-xs text-gray-500">Cliente Premium</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="cursor-pointer w-full">Meu Perfil</Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer w-full">
                          <Settings className="h-4 w-4 mr-2" />
                          Administração
                        </Link>
                      </DropdownMenuItem>
                      <div className="px-2 py-1">
                        <NavEventButton />
                      </div>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/carrinho" className="cursor-pointer w-full">Meu Carrinho</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth/login">
                <Button className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 shadow-lg hover:shadow-xl transition-all duration-300">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link to="/carrinho">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-cantinho-terracotta text-white h-6 w-6 flex items-center justify-center p-0 text-xs animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "lg:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-40 transform transition-transform duration-300 ease-in-out pt-20",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col space-y-6 p-6">
          {/* Quick Actions Mobile */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <Button
              onClick={handleFirstOrder}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white justify-start"
            >
              <Gift className="w-5 h-5 mr-3" />
              Primeiro Pedido (10% OFF)
            </Button>
            <Button
              onClick={handlePremiumCatering}
              variant="outline"
              className="border-cantinho-terracotta text-cantinho-terracotta justify-start"
            >
              Catering Premium
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-cantinho-cream/50 p-3 rounded-lg">
              <Phone className="w-4 h-4 text-cantinho-terracotta" />
              <div>
                <p className="font-medium">+244 924 678 544</p>
                <p>+244 934 625 513</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-3 text-lg block"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/menu" 
              className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-3 text-lg block"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link 
              to="/eventos" 
              className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-3 text-lg block"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link 
              to="/sobre" 
              className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-3 text-lg block"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Nós
            </Link>
            <Link 
              to="/contacto" 
              className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-3 text-lg block"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            {user ? (
              <>
                <Link 
                  to="/perfil" 
                  className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-3 text-lg block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meu Perfil
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-500 hover:text-red-600 transition duration-200 py-3 text-lg text-left w-full"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link 
                to="/auth/login" 
                className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-3 text-lg block"
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
