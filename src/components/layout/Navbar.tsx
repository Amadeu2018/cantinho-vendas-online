
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and brand name */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-cantinho-terracotta">Cantinho Algarvio</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-cantinho-terracotta transition duration-200">Início</Link>
            <Link to="/menu" className="text-foreground hover:text-cantinho-terracotta transition duration-200">Menu</Link>
            <Link to="/eventos" className="text-foreground hover:text-cantinho-terracotta transition duration-200">Eventos</Link>
            <Link to="/sobre" className="text-foreground hover:text-cantinho-terracotta transition duration-200">Sobre Nós</Link>
            <Link to="/contacto" className="text-foreground hover:text-cantinho-terracotta transition duration-200">Contacto</Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-cantinho-terracotta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="mr-4">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-cantinho-terracotta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
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
        "md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out pt-16",
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col space-y-4 p-6">
          <Link 
            to="/" 
            className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-2 text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Início
          </Link>
          <Link 
            to="/menu" 
            className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-2 text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link 
            to="/eventos" 
            className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-2 text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Eventos
          </Link>
          <Link 
            to="/sobre" 
            className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-2 text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Sobre Nós
          </Link>
          <Link 
            to="/contacto" 
            className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-2 text-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
