
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

type AdminLoginProps = {
  onLogin: (username: string, password: string) => boolean;
};

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = onLogin(username, password);
    
    if (!success) {
      toast({
        title: "Falha no login",
        description: "Nome de usuário ou senha incorretos. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="bg-cantinho-navy/10 p-3 rounded-full">
              <Lock className="h-8 w-8 text-cantinho-navy" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-center mb-6">
            Login de Administrador
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-medium">
                Nome de Usuário
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-cantinho-navy hover:bg-cantinho-navy/90"
            >
              Entrar
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p className="text-muted-foreground">
              Para fins de demonstração:<br />
              Usuário: admin<br />
              Senha: password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
