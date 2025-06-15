
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { X, Gift, Star, Phone, Home, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFirstOrder: () => void;
  onPremiumCatering: () => void;
}

const MobileMenu = ({ isOpen, onClose, onFirstOrder, onPremiumCatering }: MobileMenuProps) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className={cn(
      "lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-all duration-300",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible"
    )} onClick={onClose}>
      <div 
        className={cn(
          "absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
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
          <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
            <X className="h-6 w-6 text-cantinho-navy" />
          </Button>
        </div>

        <div className="flex flex-col h-full">
          {/* Quick Actions - Mobile Priority */}
          <div className="p-5 border-b border-gray-100">
            <div className="space-y-4">
              <Button
                onClick={onFirstOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white justify-start h-14 font-semibold shadow-lg"
              >
                <Gift className="w-6 h-6 mr-3" />
                <div className="flex flex-col items-start">
                  <span className="font-bold">Primeiro Pedido</span>
                  <span className="text-xs text-green-100">10% de desconto</span>
                </div>
              </Button>
              
              <Button
                onClick={onPremiumCatering}
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
              onClick={onClose}
            >
              <Home className="w-6 h-6 text-cantinho-terracotta" />
              <span className="text-base">Início</span>
            </Link>
            <Link 
              to="/menu" 
              className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
              onClick={onClose}
            >
              <ShoppingCart className="w-6 h-6 text-cantinho-terracotta" />
              <span className="text-base">Menu</span>
            </Link>
            <Link 
              to="/eventos" 
              className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
              onClick={onClose}
            >
              <Star className="w-6 h-6 text-cantinho-terracotta" />
              <span className="text-base">Eventos</span>
            </Link>
            <Link 
              to="/sobre" 
              className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
              onClick={onClose}
            >
              <User className="w-6 h-6 text-cantinho-terracotta" />
              <span className="text-base">Sobre Nós</span>
            </Link>
            <Link 
              to="/contacto" 
              className="flex items-center gap-4 p-4 text-cantinho-navy hover:bg-cantinho-cream rounded-xl transition-colors font-semibold"
              onClick={onClose}
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
                    onClick={onClose}
                  >
                    <User className="w-5 h-5" />
                    <span>Meu Perfil</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
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
                onClick={onClose}
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
  );
};

export default MobileMenu;
