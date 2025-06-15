
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  DollarSign, 
  Warehouse, 
  BarChart3, 
  Settings,
  Calendar
} from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-gray-50 p-1 rounded-lg">
        <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-white">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
        
        <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-white">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Pedidos</span>
        </TabsTrigger>
        
        <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-white">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">Produtos</span>
        </TabsTrigger>
        
        <TabsTrigger value="customers" className="flex items-center gap-2 data-[state=active]:bg-white">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Clientes</span>
        </TabsTrigger>
        
        <TabsTrigger value="finance" className="flex items-center gap-2 data-[state=active]:bg-white">
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">Finanças</span>
        </TabsTrigger>
        
        <TabsTrigger value="inventory" className="flex items-center gap-2 data-[state=active]:bg-white">
          <Warehouse className="h-4 w-4" />
          <span className="hidden sm:inline">Estoque</span>
        </TabsTrigger>
        
        <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-white">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Relatórios</span>
        </TabsTrigger>
        
        <TabsTrigger value="events" className="flex items-center gap-2 data-[state=active]:bg-white">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Eventos</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default DashboardTabs;
