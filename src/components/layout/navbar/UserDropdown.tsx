
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, Settings, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import NavEventButton from "../../admin/NavEventButton";

const UserDropdown = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!user) {
    return (
      <Link to="/auth/login">
        <Button className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold">
          Entrar
        </Button>
      </Link>
    );
  }

  return (
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
          <X className="h-4 w-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
