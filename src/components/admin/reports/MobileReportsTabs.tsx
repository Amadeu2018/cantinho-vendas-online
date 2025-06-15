
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";

interface MobileReportsTabsProps {
  activeTab: string;
  onValueChange: (value: string) => void;
  monthlyData: any[];
  dailyData: any[];
  topProducts: any[];
}

const MobileReportsTabs = ({ 
  activeTab, 
  onValueChange, 
  monthlyData, 
  dailyData, 
  topProducts 
}: MobileReportsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
        <TabsTrigger 
          value="monthly" 
          className="flex items-center gap-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Calendar className="h-3 w-3" />
          6M
        </TabsTrigger>
        <TabsTrigger 
          value="daily" 
          className="flex items-center gap-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <BarChart3 className="h-3 w-3" />
          7D
        </TabsTrigger>
        <TabsTrigger 
          value="products" 
          className="flex items-center gap-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <TrendingUp className="h-3 w-3" />
          Top
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-4">
        <TabsContent value="monthly" className="space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Últimos 6 Meses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.month}</p>
                    <p className="text-xs text-gray-600">{item.pedidos} pedidos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cantinho-terracotta">
                      {new Intl.NumberFormat("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                        minimumFractionDigits: 0,
                        notation: "compact"
                      }).format(item.receita)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="daily" className="space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Últimos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dailyData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm capitalize">{item.day}</p>
                    <p className="text-xs text-gray-600">{item.pedidos} pedidos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cantinho-terracotta">
                      {new Intl.NumberFormat("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                        minimumFractionDigits: 0,
                        notation: "compact"
                      }).format(item.receita)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Produtos Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-cantinho-terracotta text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="font-medium text-sm">{product.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cantinho-navy">{product.vendas}</p>
                    <p className="text-xs text-gray-600">vendas</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default MobileReportsTabs;
