
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, User, Settings } from 'lucide-react';
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
import NavEventButton from "../admin/NavEventButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

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
            {user && (
              <Link to="/carrinho">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-cantinho-terracotta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                </Button>
              </Link>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start p-2">
                    <div className="ml-2">
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="cursor-pointer w-full">Meu Perfil</Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <div className="flex ml-2">
                      <Button
                        variant="outline"
                        asChild
                      >
                        <Link to="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Administração
                        </Link>
                      </Button>
                      <NavEventButton />
                    </div>
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
                <Button variant="outline">Entrar</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && (
              <Link to="/carrinho" className="mr-4">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-cantinho-terracotta text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                </Button>
              </Link>
            )}
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
          {user && (
            <Link 
              to="/carrinho" 
              className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Carrinho
            </Link>
          )}
          
          {user ? (
            <>
              <Link 
                to="/perfil" 
                className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-2 text-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Meu Perfil
              </Link>
              <button 
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-red-500 hover:text-red-600 transition duration-200 py-2 text-lg text-left"
              >
                Sair
              </button>
            </>
          ) : (
            <Link 
              to="/auth/login" 
              className="text-foreground hover:text-cantinho-terracotta transition duration-200 py-2 text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
