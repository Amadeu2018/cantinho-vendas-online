
import { Card } from "@/components/ui/card";
import { ShoppingCart, Wallet, CalendarDays, Users, ArrowUp, ArrowDown } from "lucide-react";

interface DashboardStatsProps {
  todaysOrders: number;
  totalRevenue: number;
}

const DashboardStats = ({ todaysOrders, totalRevenue }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="p-6 transition-all hover:shadow-md hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pedidos Hoje</p>
            <h3 className="text-2xl font-bold text-gray-800">{todaysOrders}</h3>
          </div>
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-500 text-sm font-semibold flex items-center">
            <ArrowUp className="h-3 w-3 mr-1" /> 12%
          </span>
          <span className="text-gray-500 text-sm"> vs ontem</span>
        </div>
      </Card>
      
      <Card className="p-6 transition-all hover:shadow-md hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Receita Total</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {new Intl.NumberFormat("pt-AO", {
                style: "currency",
                currency: "AOA",
                minimumFractionDigits: 0,
              }).format(totalRevenue)}
            </h3>
          </div>
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-500 text-sm font-semibold flex items-center">
            <ArrowUp className="h-3 w-3 mr-1" /> 8%
          </span>
          <span className="text-gray-500 text-sm"> vs ontem</span>
        </div>
      </Card>
      
      <Card className="p-6 transition-all hover:shadow-md hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Eventos Agendados</p>
            <h3 className="text-2xl font-bold text-gray-800">3</h3>
          </div>
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-red-500 text-sm font-semibold flex items-center">
            <ArrowDown className="h-3 w-3 mr-1" /> 1
          </span>
          <span className="text-gray-500 text-sm"> vs ontem</span>
        </div>
      </Card>
      
      <Card className="p-6 transition-all hover:shadow-md hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Clientes Novos</p>
            <h3 className="text-2xl font-bold text-gray-800">5</h3>
          </div>
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-500 text-sm font-semibold flex items-center">
            <ArrowUp className="h-3 w-3 mr-1" /> 2
          </span>
          <span className="text-gray-500 text-sm"> vs ontem</span>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;
