
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import MobileCartSummary from "@/components/cart/MobileCartSummary";
import { CartItem } from '@/contexts/CartContext';

type NavLink = {
  text: string;
  to: string;
};

type MobileMenuProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks: NavLink[];
  items: CartItem[];
  user: any;
  onSignOut: () => void;
};

const MobileMenu = ({ 
  isOpen, 
  onOpenChange, 
  navLinks, 
  items, 
  user, 
  onSignOut 
}: MobileMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px]">
        <div className="py-6 flex flex-col h-full">
          <div className="flex-1 mb-6">
            <nav className="flex flex-col space-y-5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-lg font-medium hover:text-cantinho-terracotta"
                  onClick={() => onOpenChange(false)}
                >
                  {link.text}
                </Link>
              ))}

              {!user && (
                <>
                  <Link
                    to="/auth/login"
                    className="text-lg font-medium hover:text-cantinho-terracotta"
                    onClick={() => onOpenChange(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/register"
                    className="text-lg font-medium hover:text-cantinho-terracotta"
                    onClick={() => onOpenChange(false)}
                  >
                    Registrar
                  </Link>
                </>
              )}

              {user && (
                <>
                  <Link
                    to="/perfil"
                    className="text-lg font-medium hover:text-cantinho-terracotta"
                    onClick={() => onOpenChange(false)}
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/pedidos"
                    className="text-lg font-medium hover:text-cantinho-terracotta"
                    onClick={() => onOpenChange(false)}
                  >
                    Meus Pedidos
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-lg font-medium hover:text-cantinho-terracotta"
                      onClick={() => onOpenChange(false)}
                    >
                      Área Admin
                    </Link>
                  )}
                  <button
                    className="text-lg font-medium hover:text-cantinho-terracotta text-left"
                    onClick={() => {
                      onSignOut();
                      onOpenChange(false);
                    }}
                  >
                    Sair
                  </button>
                </>
              )}
            </nav>
          </div>

          {items.length > 0 && (
            <div className="mt-auto">
              <MobileCartSummary
                onCheckout={() => onOpenChange(false)}
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
