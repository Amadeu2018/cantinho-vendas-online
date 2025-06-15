
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
    <nav className="sticky top-0 z-50 bg-white shadow-xl border-b-2 border-cantinho-terracotta/20">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Mobile Optimized */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={closeMenu}>
            <div className="bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy p-2 sm:p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
              <div className="w-7 h-7 sm:w-9 sm:h-9 bg-white rounded-lg flex items-center justify-center">
                <span className="text-cantinho-terracotta font-bold text-base sm:text-xl">C</span>
              </div>
            </div>
            <div className="min-w-0">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cantinho-terracotta to-cantinho-navy bg-clip-text text-transparent truncate block">
                Cantinho Algarvio
              </span>
              <div className="flex items-center gap-1 -mt-0.5">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 fill-current flex-shrink-0" />
                <span className="text-xs sm:text-sm text-cantinho-navy font-medium truncate">Premium Delivery</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Enhanced visibility */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-cantinho-navy font-semibold hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Início</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/menu" className="text-cantinho-navy font-semibold hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Menu</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/eventos" className="text-cantinho-navy font-semibold hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Eventos</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/sobre" className="text-cantinho-navy font-semibold hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Sobre</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            <Link to="/contacto" className="text-cantinho-navy font-semibold hover:text-cantinho-terracotta transition duration-300 relative group">
              <span>Contacto</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cantinho-terracotta transition-all duration-300 group-hover:w-full"></div>
            </Link>
            
            {/* Quick Action Buttons - Desktop */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleFirstOrder}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              >
                <Gift className="w-4 h-4 mr-2" />
                Primeiro Pedido
              </Button>
              
              <Button
                onClick={handlePremiumCatering}
                size="sm"
                variant="outline"
                className="border-2 border-cantinho-terracotta text-cantinho-terracotta hover:bg-cantinho-terracotta hover:text-white transition-all duration-300 font-semibold"
              >
                Catering Premium
              </Button>
            </div>
          </div>

          {/* Right side actions - Mobile optimized */}
          <div className="flex items-center gap-2">
            {/* Cart button */}
            <Link to="/carrinho">
              <Button variant="ghost" size="icon" className="relative hover:bg-cantinho-cream transition-colors h-11 w-11">
                <ShoppingCart className="h-6 w-6 text-cantinho-navy" />
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
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-cantinho-cream transition-colors h-11 w-11">
                      <User className="h-6 w-6 text-cantinho-navy" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-white shadow-2xl border-2 border-cantinho-terracotta/20 z-50">
                    <div className="flex items-center justify-start p-4 bg-gradient-to-r from-cantinho-cream to-white">
                      <div className="bg-cantinho-terracotta text-white w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-cantinho-navy">{user.email}</p>
                        <p className="text-xs text-gray-500">Cliente Premium</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="cursor-pointer w-full font-medium">Meu Perfil</Link>
                    </DropdownMenuItem>
                    {user?.role === "admin" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer w-full font-medium">
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
                      <Link to="/carrinho" className="cursor-pointer w-full font-medium">Meu Carrinho</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600 font-medium">
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:block">
                <Link to="/auth/login">
                  <Button className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
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
              className="lg:hidden h-11 w-11 hover:bg-cantinho-cream transition-colors"
            >
              {isMenuOpen ? <X className="h-7 w-7 text-cantinho-navy" /> : <Menu className="h-7 w-7 text-cantinho-navy" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay - Enhanced visibility */}
      <div className={cn(
        "lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300",
        isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )} onClick={closeMenu}>
        <div 
          className={cn(
            "absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-5 border-b-2 border-cantinho-terracotta/20 bg-gradient-to-r from-cantinho-cream to-white">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy p-2 rounded-lg">
                <div className="w-7 h-7 bg-white rounded flex items-center justify-center">
                  <span className="text-cantinho-terracotta font-bold text-sm">C</span>
                </div>
              </div>
              <span className="font-bold text-cantinho-navy text-lg">Menu</span>
            </div>
            <Button variant="ghost" size="icon" onClick={closeMenu} className="h-9 w-9">
              <X className="h-6 w-6 text-cantinho-navy" />
            </Button>
          </div>

          <div className="flex flex-col h-full">
            {/* Quick Actions - Mobile Priority */}
            <div className="p-5 border-b border-gray-100">
              <div className="space-y-4">
                <Button
                  onClick={handleFirstOrder}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white justify-start h-14 font-semibold shadow-lg"
                >
                  <Gift className="w-6 h-6 mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="font-bold">Primeiro Pedido</span>
                    <span className="text-xs text-green-100">10% de desconto</span>
                  </div>
                </Button>
                
                <Button
                  onClick={handlePremiumCatering}
                  variant="outline"
                  className="w-full border-2 border-cantinho-terracotta text-cantinho-terracotta justify-start h-14 hover:bg-cantinho-terracotta hover:text-white font-semibold"
                >
                  <Star className="w-6 h-6 mr-3" />
                  <span className="font-bold">Catering Premium</span>
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-4 bg-cantinho-cream/50 p-4 rounded-xl">
                <Phone className="w-6 h-6 text-cantinho-terracotta flex-shrink-0" />
                <div>
                  <p className="font-bold text-sm text-cantinho-navy">Ligue Agora</p>
                  <div className="text-sm text-cantinho-navy font-medium">
                    <p>+244 924 678 544</p>
                    <p>+244 934 625 513</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="flex-1 p-5 space-y-2">
              <Link 
                to="/" 
                className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
                onClick={closeMenu}
              >
                <Home className="w-6 h-6 text-cantinho-terracotta" />
                <span className="text-base">Início</span>
              </Link>
              <Link 
                to="/menu" 
                className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
                onClick={closeMenu}
              >
                <ShoppingCart className="w-6 h-6 text-cantinho-terracotta" />
                <span className="text-base">Menu</span>
              </Link>
              <Link 
                to="/eventos" 
                className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
                onClick={closeMenu}
              >
                <Star className="w-6 h-6 text-cantinho-terracotta" />
                <span className="text-base">Eventos</span>
              </Link>
              <Link 
                to="/sobre" 
                className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
                onClick={closeMenu}
              >
                <User className="w-6 h-6 text-cantinho-terracotta" />
                <span className="text-base">Sobre Nós</span>
              </Link>
              <Link 
                to="/contacto" 
                className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
                onClick={closeMenu}
              >
                <Phone className="w-6 h-6 text-cantinho-terracotta" />
                <span className="text-base">Contacto</span>
              </Link>
            </div>
            
            {/* User section - Mobile */}
            <div className="p-5 border-t-2 border-cantinho-terracotta/20 bg-gray-50">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-cantinho-cream/70 rounded-xl">
                    <div className="bg-cantinho-terracotta text-white w-11 h-11 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-cantinho-navy truncate">{user.email}</p>
                      <p className="text-xs text-gray-600">Cliente Premium</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link 
                      to="/perfil" 
                      className="flex items-center gap-3 p-3 text-cantinho-navy hover:bg-cantinho-cream rounded-lg transition-colors w-full font-semibold"
                      onClick={closeMenu}
                    >
                      <User className="w-5 h-5" />
                      <span>Meu Perfil</span>
                    </Link>
                    
                    {user?.role === "admin" && (
                      <Link 
                        to="/admin" 
                        className="flex items-center gap-3 p-3 text-cantinho-navy hover:bg-cantinho-cream rounded-lg transition-colors w-full font-semibold"
                        onClick={closeMenu}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Administração</span>
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full text-left font-semibold"
                    >
                      <X className="w-5 h-5" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/auth/login" 
                  className="w-full"
                  onClick={closeMenu}
                >
                  <Button className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 shadow-lg font-semibold h-12">
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
