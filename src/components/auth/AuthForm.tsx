
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialAuthButtons from "./SocialAuthButtons";

type AuthFormProps = {
  mode: "login" | "register";
};

type AuthMethod = "email" | "phone";

const AuthForm = ({ mode }: AuthFormProps) => {
  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, signInWithPhone, signUpWithPhone } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (authMethod === "email") {
        if (mode === "login") {
          await signIn(email, password);
          navigate("/");
        } else {
          await signUp(email, password);
          toast({
            title: "Verifique seu email",
            description: "Enviamos um link de confirmação para o seu email.",
          });
        }
      } else if (authMethod === "phone") {
        if (mode === "login") {
          await signInWithPhone(phone, password);
          navigate("/");
        } else {
          await signUpWithPhone(phone, password);
          toast({
            title: "Conta criada com sucesso",
            description: "Você já pode fazer login com seu número de telefone.",
          });
        }
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

          {/* Social Authentication */}
          <div className="mb-6">
            <SocialAuthButtons mode={mode} />
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
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="phone" className="block mb-1 text-sm font-medium">
                  Número de Telefone
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
                <p className="text-xs text-gray-500 mt-1">
                  Inclua o código do país (ex: +244 para Angola)
                </p>
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
                  minLength={6}
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
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? "Processando..." 
                : mode === "login" 
                  ? "Entrar" 
                  : "Criar conta"}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-500 space-y-2">
            {mode === "login" && (
              <p>
                <a href="/auth/reset-password" className="text-cantinho-navy hover:underline">
                  Esqueceu sua senha?
                </a>
              </p>
            )}
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
