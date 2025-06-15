
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, Settings, Gift, Phone, Star, Home } from 'lucide-react';
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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-cantinho-terracotta/10">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Mobile Optimized */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={closeMenu}>
            <div className="bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy p-1.5 sm:p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-cantinho-terracotta font-bold text-sm sm:text-lg">C</span>
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cantinho-terracotta to-cantinho-navy bg-clip-text text-transparent truncate block">
                Cantinho Algarvio
              </span>
              <div className="flex items-center gap-1 -mt-0.5">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-current flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">Premium Delivery</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
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
              <span>Sobre</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/contacto" className="text-foreground hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Contacto</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            
            {/* Quick Action Buttons - Desktop */}
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
          </div>

          {/* Right side actions - Mobile optimized */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            <Link to="/carrinho">
              <Button variant="ghost" size="icon" className="relative hover:bg-cantinho-cream transition-colors h-10 w-10">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-cantinho-terracotta text-white h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* User menu - Desktop */}
            {user ? (
              <div className="hidden lg:block">
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
              </div>
            ) : (
              <div className="hidden lg:block">
                <Link to="/auth/login">
                  <Button className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 shadow-lg hover:shadow-xl transition-all duration-300">
                    Entrar
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="lg:hidden h-10 w-10 hover:bg-cantinho-cream transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={closeMenu}>
        <div 
          className={cn(
            "absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy p-1.5 rounded-lg">
                <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-cantinho-terracotta font-bold text-sm">C</span>
                </div>
              </div>
              <span className="font-bold text-cantinho-navy">Menu</span>
            </div>
            <Button variant="ghost" size="icon" onClick={closeMenu} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col h-full">
            {/* Quick Actions - Mobile Priority */}
            <div className="p-4 border-b border-gray-100">
              <div className="space-y-3">
                <Button
                  onClick={handleFirstOrder}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white justify-start h-12"
                >
                  <Gift className="w-5 h-5 mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Primeiro Pedido</span>
                    <span className="text-xs text-green-100">10% de desconto</span>
                  </div>
                </Button>
                
                <Button
                  onClick={handlePremiumCatering}
                  variant="outline"
                  className="w-full border-cantinho-terracotta text-cantinho-terracotta justify-start h-12 hover:bg-cantinho-terracotta hover:text-white"
                >
                  <Star className="w-5 h-5 mr-3" />
                  <span className="font-semibold">Catering Premium</span>
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3 bg-cantinho-cream/30 p-3 rounded-lg">
                <Phone className="w-5 h-5 text-cantinho-terracotta flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-cantinho-navy">Ligue Agora</p>
                  <div className="text-xs text-gray-600">
                    <p>+244 924 678 544</p>
                    <p>+244 934 625 513</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="flex-1 p-4 space-y-1">
              <Link 
                to="/" 
                className="flex items-center gap-3 p-3 text-foreground hover:bg-cantinho-cream rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <Home className="w-5 h-5 text-cantinho-terracotta" />
                <span className="font-medium">Início</span>
              </Link>
              <Link 
                to="/menu" 
                className="flex items-center gap-3 p-3 text-foreground hover:bg-cantinho-cream rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <ShoppingCart className="w-5 h-5 text-cantinho-terracotta" />
                <span className="font-medium">Menu</span>
              </Link>
              <Link 
                to="/eventos" 
                className="flex items-center gap-3 p-3 text-foreground hover:bg-cantinho-cream rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <Star className="w-5 h-5 text-cantinho-terracotta" />
                <span className="font-medium">Eventos</span>
              </Link>
              <Link 
                to="/sobre" 
                className="flex items-center gap-3 p-3 text-foreground hover:bg-cantinho-cream rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <User className="w-5 h-5 text-cantinho-terracotta" />
                <span className="font-medium">Sobre Nós</span>
              </Link>
              <Link 
                to="/contacto" 
                className="flex items-center gap-3 p-3 text-foreground hover:bg-cantinho-cream rounded-lg transition-colors"
                onClick={closeMenu}
              >
                <Phone className="w-5 h-5 text-cantinho-terracotta" />
                <span className="font-medium">Contacto</span>
              </Link>
            </div>
            
            {/* User section - Mobile */}
            <div className="p-4 border-t border-gray-100">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-cantinho-cream/50 rounded-lg">
                    <div className="bg-cantinho-terracotta text-white w-10 h-10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-cantinho-navy truncate">{user.email}</p>
                      <p className="text-xs text-gray-500">Cliente Premium</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Link 
                      to="/perfil" 
                      className="flex items-center gap-3 p-2 text-foreground hover:bg-cantinho-cream rounded-lg transition-colors w-full"
                      onClick={closeMenu}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Meu Perfil</span>
                    </Link>
                    
                    {user?.role === "admin" && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 p-2 text-foreground hover:bg-cantinho-cream rounded-lg transition-colors w-full"
                        onClick={closeMenu}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Administração</span>
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                    >
                      <X className="w-4 h-4" />
                      <span className="text-sm">Sair</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/auth/login" 
                  className="w-full"
                  onClick={closeMenu}
                >
                  <Button className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 shadow-lg">
                    Entrar
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
