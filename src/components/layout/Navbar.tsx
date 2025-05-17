
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import MobileCartSummary from "@/components/cart/MobileCartSummary";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items, totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return email.substring(0, 1).toUpperCase();
  };

  const navLinks = [
    { text: "Home", to: "/" },
    { text: "Menu", to: "/menu" },
    { text: "Sobre", to: "/sobre" },
    { text: "Eventos", to: "/eventos" },
    { text: "Contato", to: "/contato" },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Cantinho Algarvio"
              className="h-10 md:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 hover:text-cantinho-terracotta transition-colors"
              >
                {link.text}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Cart */}
            <Link to="/carrinho">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 border"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-cantinho-navy text-white">
                        {getInitials(user.email || "")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pedidos">Meus Pedidos</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Área Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  {mobileMenuOpen ? (
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
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.text}
                        </Link>
                      ))}

                      {!user && (
                        <>
                          <Link
                            to="/auth/login"
                            className="text-lg font-medium hover:text-cantinho-terracotta"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            to="/auth/register"
                            className="text-lg font-medium hover:text-cantinho-terracotta"
                            onClick={() => setMobileMenuOpen(false)}
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
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Meu Perfil
                          </Link>
                          <Link
                            to="/pedidos"
                            className="text-lg font-medium hover:text-cantinho-terracotta"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Meus Pedidos
                          </Link>
                          {user.role === "admin" && (
                            <Link
                              to="/admin"
                              className="text-lg font-medium hover:text-cantinho-terracotta"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Área Admin
                            </Link>
                          )}
                          <button
                            className="text-lg font-medium hover:text-cantinho-terracotta text-left"
                            onClick={() => {
                              handleSignOut();
                              setMobileMenuOpen(false);
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
                        onCheckout={() => setMobileMenuOpen(false)}
                      />
                    </div>
                  )}
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
