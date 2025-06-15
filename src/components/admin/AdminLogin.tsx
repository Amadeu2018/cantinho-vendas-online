
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialAuthButtons from "../auth/SocialAuthButtons";

type AdminLoginProps = {
  onLogin: (isAdmin: boolean) => void;
};

type AuthMethod = "email" | "phone";

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signInWithPhone } = useAuth();

  const checkAdminRole = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data.role === 'admin';
    } catch (error) {
      console.error("Erro ao verificar role:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (authMethod === "email") {
        await signIn(email, password);
      } else {
        await signInWithPhone(phone, password);
      }
      
      const isAdmin = await checkAdminRole();
      
      if (isAdmin) {
        onLogin(true);
      } else {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissões de administrador.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      toast({
        title: "Falha no login",
        description: "Credenciais incorretas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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

          {/* Social Authentication */}
          <div className="mb-6">
            <SocialAuthButtons mode="login" />
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          {/* Auth Method Selection */}
          <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as AuthMethod)} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMethod === "email" ? (
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
                    placeholder="admin@exemplo.com"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block mb-1 text-sm font-medium">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    placeholder="+244 900 000 000"
                    required
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-cantinho-navy hover:bg-cantinho-navy/90"
              disabled={isLoading}
            >
              {isLoading ? "Processando..." : "Entrar"}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p className="text-muted-foreground">
              Para fins de demonstração:<br />
              Email: admin@exemplo.com<br />
              Senha: password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
