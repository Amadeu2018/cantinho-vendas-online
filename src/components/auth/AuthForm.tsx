
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AuthFormProps = {
  mode: "login" | "register";
};

const AuthForm = ({ mode }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (mode === "login") {
        await signIn(email, password);
        navigate("/");
      } else {
        await signUp(email, password);
        // Não navegar automaticamente após o registro, pois pode precisar verificar o email
        toast({
          title: "Verifique seu email",
          description: "Enviamos um link de confirmação para o seu email.",
        });
      }
    } catch (error) {
      console.error("Erro na autenticação:", error);
    } finally {
      setIsSubmitting(false);
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
            {mode === "login" ? "Entrar na sua conta" : "Criar uma nova conta"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="seu@email.com"
                  required
                />
              </div>
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
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-cantinho-navy hover:bg-cantinho-navy/90"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Processando..." 
                : mode === "login" 
                  ? "Entrar" 
                  : "Criar conta"}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            {mode === "login" ? (
              <p>
                Não tem uma conta?{" "}
                <a href="/auth/register" className="text-cantinho-navy hover:underline">
                  Registre-se
                </a>
              </p>
            ) : (
              <p>
                Já tem uma conta?{" "}
                <a href="/auth/login" className="text-cantinho-navy hover:underline">
                  Entrar
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
