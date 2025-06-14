
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle }  from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ChefHat, 
  Clock, 
  MapPin, 
  Star, 
  Gift, 
  ArrowRight,
  Utensils,
  Phone
} from "lucide-react";

const FirstOrderWelcome = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Desconto de Boas-vindas",
      description: "10% de desconto no seu primeiro pedido"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Entrega Rápida",
      description: "Entregamos em 20-30 minutos em média"
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: "Pratos Autênticos",
      description: "Culinária portuguesa e angolana genuína"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Qualidade Premium",
      description: "Ingredientes frescos e receitas tradicionais"
    }
  ];

  const steps = [
    {
      title: "Bem-vindo ao Cantinho Algarvio!",
      description: "Está pronto para descobrir os sabores autênticos da nossa cozinha?",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-cantinho-terracotta/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-10 h-10 text-cantinho-terracotta" />
            </div>
            <h2 className="text-3xl font-bold text-cantinho-navy mb-4">
              O seu primeiro pedido é especial!
            </h2>
            <p className="text-gray-600 text-lg">
              Desfrute de uma experiência gastronómica única com sabores que transportam 
              diretamente para as tradições culinárias de Portugal e Angola.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Benefícios Exclusivos",
      description: "Veja o que temos preparado para si:",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-2 border-cantinho-terracotta/20 hover:border-cantinho-terracotta/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-cantinho-terracotta/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-cantinho-terracotta">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-cantinho-navy mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      title: "Como Funciona",
      description: "Fazer o seu pedido é muito simples:",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-cantinho-navy text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-bold mb-2">Escolha os Pratos</h3>
              <p className="text-gray-600 text-sm">
                Navegue pelo nosso menu e adicione os seus pratos favoritos
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cantinho-navy text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-bold mb-2">Confirme o Pedido</h3>
              <p className="text-gray-600 text-sm">
                Revise os itens e forneça os dados de entrega
              </p>
            </div>
            <div className="text-center">
              <div className="bg-cantinho-navy text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-bold mb-2">Receba em Casa</h3>
              <p className="text-gray-600 text-sm">
                Relaxe enquanto preparamos e entregamos na sua porta
              </p>
            </div>
          </div>
          
          <div className="bg-cantinho-cream/50 p-6 rounded-xl text-center">
            <Badge className="bg-cantinho-terracotta text-white mb-3">
              Oferta Especial
            </Badge>
            <p className="text-lg font-semibold text-cantinho-navy mb-2">
              Use o código: PRIMEIRO10
            </p>
            <p className="text-gray-600">
              E ganhe 10% de desconto no seu primeiro pedido!
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/menu");
    }
  };

  const handleSkip = () => {
    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cantinho-cream to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-cantinho-terracotta' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl text-cantinho-navy">
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-gray-600 text-lg">
            {steps[currentStep].description}
          </p>
        </CardHeader>
        
        <CardContent className="pb-8">
          <div className="mb-8">
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              Pular Introdução
            </Button>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="border-cantinho-terracotta text-cantinho-terracotta hover:bg-cantinho-terracotta hover:text-white"
                >
                  Anterior
                </Button>
              )}
              <Button
                onClick={handleNext}
                className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 px-8"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    <Utensils className="mr-2 h-4 w-4" />
                    Explorar Menu
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Contact info at bottom */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-500 text-sm mb-2">
              Precisa de ajuda? Entre em contacto:
            </p>
            <div className="flex justify-center items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4 text-cantinho-terracotta" />
                <span>+244 924 678 544</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-cantinho-terracotta" />
                <span>Luanda, Bairro Azul</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FirstOrderWelcome;
