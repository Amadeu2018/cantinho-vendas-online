
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Shield, UserPlus, Eye, EyeOff } from "lucide-react";
import { CustomerInfo } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CustomerInfoForm = ({ customerInfo, onChange }: CustomerInfoFormProps) => {
  const { user, signUp } = useAuth();
  const { toast } = useToast();
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // Auto-fill email if user is logged in
  React.useEffect(() => {
    if (user && user.email && !customerInfo.name) {
      const emailEvent = {
        target: { name: 'email', value: user.email }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(emailEvent);
    }
  }, [user, customerInfo.name, onChange]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    
    // Show password field if user is not logged in and email is filled
    if (!user && e.target.value && e.target.value.includes('@')) {
      setShowPasswordField(true);
    } else if (!e.target.value) {
      setShowPasswordField(false);
      setPassword("");
    }
  };

  const handleCreateAccount = async () => {
    if (!customerInfo.email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o email e a senha",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreatingAccount(true);
      await signUp(customerInfo.email, password);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar sua conta. Você pode continuar com o pedido.",
      });
      
      setShowPasswordField(false);
      setPassword("");
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao criar a conta",
        variant: "destructive"
      });
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-cantinho-cream/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-cantinho-navy">
          <Shield className="w-5 h-5" />
          <span>Informações de Entrega</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
              Nome Completo *
            </label>
            <Input
              id="name"
              name="name"
              value={customerInfo.name}
              onChange={onChange}
              placeholder="Seu nome completo"
              required
              className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
              Telefone *
            </label>
            <Input
              id="phone"
              name="phone"
              value={customerInfo.phone}
              onChange={onChange}
              placeholder="Ex: +244 924 678 544"
              required
              className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={customerInfo.email || (user?.email || "")}
            onChange={handleEmailChange}
            placeholder="seu@email.com"
            required
            disabled={!!user}
            className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta disabled:bg-gray-100"
          />
          {user && (
            <p className="text-xs text-green-600 mt-1">✓ Utilizando email da conta logada</p>
          )}
        </div>

        {/* Password field for account creation */}
        {showPasswordField && !user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <UserPlus className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">
                Criar conta para acompanhar pedidos
              </span>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Criar senha (mínimo 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  onClick={handleCreateAccount}
                  disabled={isCreatingAccount || !password || password.length < 6}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isCreatingAccount ? "Criando..." : "Criar Conta"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowPasswordField(false);
                    setPassword("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Continuar sem conta
                </Button>
              </div>
              <p className="text-xs text-blue-600">
                ✓ Acompanhe seus pedidos • ✓ Histórico de compras • ✓ Ofertas exclusivas
              </p>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-700">
            Endereço Detalhado *
          </label>
          <Input
            id="address"
            name="address"
            value={customerInfo.address}
            onChange={onChange}
            placeholder="Rua, número, bairro, referências..."
            required
            className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block mb-2 text-sm font-medium text-gray-700">
            Observações (opcional)
          </label>
          <Textarea
            id="notes"
            name="notes"
            value={customerInfo.notes}
            onChange={onChange}
            placeholder="Instruções especiais para entrega ou preparo dos pratos..."
            rows={3}
            className="border-gray-300 focus:border-cantinho-terracotta focus:ring-cantinho-terracotta resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoForm;
