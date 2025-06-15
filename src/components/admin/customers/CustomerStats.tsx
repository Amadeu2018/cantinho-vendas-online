
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserPlus, TrendingUp, Activity } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerStatsProps {
  stats: {
    total: number;
    active: number;
    newThisMonth: number;
    totalRevenue: number;
    avgOrderValue: string;
  };
}

const CustomerStats = ({ stats }: CustomerStatsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm">Total</p>
              <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
            </div>
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm">Ativos</p>
              <p className="text-xl sm:text-2xl font-bold">{stats.active}</p>
            </div>
            <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-green-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm">Novos</p>
              <p className="text-xl sm:text-2xl font-bold">{stats.newThisMonth}</p>
            </div>
            <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-purple-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white col-span-2 lg:col-span-1 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-xs sm:text-sm">Receita</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                {new Intl.NumberFormat("pt-AO", {
                  style: "currency",
                  currency: "AOA",
                  minimumFractionDigits: 0,
                  notation: isMobile ? "compact" : "standard"
                }).format(stats.totalRevenue)}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-orange-200" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white col-span-2 lg:col-span-1 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-xs sm:text-sm">Média Pedidos</p>
              <p className="text-xl sm:text-2xl font-bold">{stats.avgOrderValue}</p>
            </div>
            <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-teal-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerStats;
