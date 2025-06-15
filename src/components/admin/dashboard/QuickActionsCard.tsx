
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Plus, FileText, Package, Users, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuickActionsCardProps {
  onTabChange: (tab: string) => void;
}

const QuickActionsCard = ({ onTabChange }: QuickActionsCardProps) => {
  const isMobile = useIsMobile();

  const quickActions = [
    {
      title: "Novo Pedido",
      description: "Criar pedido manual",
      icon: Plus,
      action: () => onTabChange("orders"),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Relatórios",
      description: "Gerar relatório",
      icon: FileText,
      action: () => onTabChange("reports"),
      color: "from-green-500 to-green-600"
    },
    {
      title: "Inventário",
      description: "Verificar estoque",
      icon: Package,
      action: () => onTabChange("inventory"),
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Clientes",
      description: "Gerenciar clientes",
      icon: Users,
      action: () => onTabChange("customers"),
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Produtos",
      description: "Gerenciar produtos",
      icon: Package,
      action: () => onTabChange("products"),
      color: "from-teal-500 to-teal-600"
    },
    {
      title: "Configurações",
      description: "Ajustar sistema",
      icon: Settings,
      action: () => onTabChange("settings"),
      color: "from-pink-500 to-pink-600"
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-cantinho-sky/10 to-cantinho-sage/10 border-cantinho-sage/20 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-cantinho-navy flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-cantinho-terracotta" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-3`}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                onClick={action.action}
                className={`p-4 h-auto bg-white hover:bg-gradient-to-br hover:${action.color} hover:text-white hover:border-transparent text-left border border-gray-200 hover:shadow-md transition-all duration-300 hover:scale-105 group`}
              >
                <div className="flex flex-col items-start w-full gap-2">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4 text-cantinho-terracotta group-hover:text-white transition-colors" />
                    <div className="text-sm font-medium text-gray-900 group-hover:text-white transition-colors">
                      {action.title}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-white/90 transition-colors">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsCard;
