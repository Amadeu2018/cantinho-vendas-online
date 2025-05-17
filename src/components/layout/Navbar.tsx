
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import CartButton from "./CartButton";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

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
          <NavLogo />
          <NavLinks links={navLinks} />

          <div className="flex items-center space-x-2 md:space-x-4">
            <CartButton totalItems={totalItems} />
            <UserMenu 
              user={user} 
              signOut={signOut} 
              getInitials={getInitials} 
            />
            <MobileMenu 
              isOpen={mobileMenuOpen}
              onOpenChange={setMobileMenuOpen}
              navLinks={navLinks}
              items={items}
              user={user}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
