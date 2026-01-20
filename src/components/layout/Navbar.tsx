
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Badge } from "@/components/ui/badge";
import MobileMenu from './navbar/MobileMenu';
import UserDropdown from './navbar/UserDropdown';
import QuickActions from './navbar/QuickActions';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-xl border-b-2 border-cantinho-terracotta/20">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Mobile Optimized */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={closeMenu}>
              <div className="bg-gradient-to-br from-cantinho-terracotta to-cantinho-navy p-2 sm:p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="w-7 h-7 sm:w-9 sm:h-9 bg-transparent rounded-lg flex items-center justify-center">
                  <img src="/logo_algarvio.png" alt="Cantinho Logo" className="h-10 w-auto" />
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
              <QuickActions />
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
              
              {/* User menu - Visible on all screens */}
              <UserDropdown />

              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
                className="lg:hidden h-11 w-11 hover:bg-cantinho-cream transition-colors"
              >
                <Menu className="h-7 w-7 text-cantinho-navy" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        onFirstOrder={handleFirstOrder}
        onPremiumCatering={handlePremiumCatering}
      />
    </>
  );
};

export default Navbar;
