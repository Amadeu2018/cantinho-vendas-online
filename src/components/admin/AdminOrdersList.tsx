
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrders from "./AdminOrders";
import OrdersLayout from "./orders/OrdersLayout";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface AdminOrdersListProps {
  orders: any[];
  onSelectOrder: (orderId: string) => void;
  fetchingOrders: boolean;
}

const AdminOrdersList = ({ orders, onSelectOrder, fetchingOrders }: AdminOrdersListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const isMobile = useIsMobile();
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    
    const customerName = order.customerInfo?.name?.toLowerCase() || '';
    const orderId = order.id?.toLowerCase() || '';
    const itemNames = order.items?.map((item: any) => 
      item.name?.toLowerCase() || ''
    ).join(' ') || '';
    
    return (
      customerName.includes(searchLower) ||
      orderId.includes(searchLower) ||
      itemNames.includes(searchLower)
    );
  });
  
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "highest":
        return parseFloat(b.total) - parseFloat(a.total);
      case "lowest":
        return parseFloat(a.total) - parseFloat(b.total);
      default:
        return 0;
    }
  });
  
  const getOrdersByStatus = (status: string) => {
    if (status === "all") return sortedOrders;
    return sortedOrders.filter(order => order.status === status);
  };

  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export orders");
  };

  return (
    <OrdersLayout
      selectedOrderId={null}
      onBackToList={() => {}}
      totalOrders={orders.length}
      pendingOrders={pendingOrders}
      onExport={handleExport}
    >
      <div className="p-4">
        {fetchingOrders ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin mr-2 text-cantinho-navy" />
            <p className="text-sm">Carregando pedidos...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Search and sort controls */}
            <div className="flex flex-col gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Pesquisar pedidos..." 
                    className="pl-10 bg-white border-gray-200 text-sm h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col xs:flex-row gap-2">
                  <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                    <SelectTrigger className="w-full xs:w-[160px] bg-white border-gray-200 text-sm h-9">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mais recentes</SelectItem>
                      <SelectItem value="oldest">Mais antigos</SelectItem>
                      <SelectItem value="highest">Maior valor</SelectItem>
                      <SelectItem value="lowest">Menor valor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="w-full xs:w-auto border-gray-200 bg-white text-sm h-9 px-3"
                    onClick={() => {
                      setSearchTerm("");
                      setSortOrder("newest");
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden bg-white rounded-lg border border-gray-100 shadow-sm">
              <Tabs defaultValue="pending" className="w-full">
                <div className="border-b border-gray-200 bg-gray-50 p-1">
                  <TabsList className={`w-full h-auto bg-transparent ${isMobile ? 'overflow-x-auto flex no-scrollbar' : 'flex-wrap justify-center'}`}>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-white text-xs px-2 py-2 whitespace-nowrap flex-shrink-0">
                      Pendentes
                    </TabsTrigger>
                    <TabsTrigger value="confirmed" className="data-[state=active]:bg-white text-xs px-2 py-2 whitespace-nowrap flex-shrink-0">
                      Confirmados
                    </TabsTrigger>
                    <TabsTrigger value="preparing" className="data-[state=active]:bg-white text-xs px-2 py-2 whitespace-nowrap flex-shrink-0">
                      Em Preparo
                    </TabsTrigger>
                    <TabsTrigger value="delivering" className="data-[state=active]:bg-white text-xs px-2 py-2 whitespace-nowrap flex-shrink-0">
                      Em Entrega
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="data-[state=active]:bg-white text-xs px-2 py-2 whitespace-nowrap flex-shrink-0">
                      Concluídos
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="data-[state=active]:bg-white text-xs px-2 py-2 whitespace-nowrap flex-shrink-0">
                      Cancelados
                    </TabsTrigger>
                    <TabsTrigger value="all" className="data-[state=active]:bg-white text-xs px-2 py-2 whitespace-nowrap flex-shrink-0">
                      Todos
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="pending" className="p-3">
                  <AdminOrders 
                    orders={getOrdersByStatus("pending")} 
                    onSelectOrder={onSelectOrder}
                  />
                </TabsContent>
                
                <TabsContent value="confirmed" className="p-3">
                  <AdminOrders 
                    orders={getOrdersByStatus("confirmed")} 
                    onSelectOrder={onSelectOrder}
                  />
                </TabsContent>
                
                <TabsContent value="preparing" className="p-3">
                  <AdminOrders 
                    orders={getOrdersByStatus("preparing")} 
                    onSelectOrder={onSelectOrder}
                  />
                </TabsContent>
                
                <TabsContent value="delivering" className="p-3">
                  <AdminOrders 
                    orders={getOrdersByStatus("delivering")} 
                    onSelectOrder={onSelectOrder}
                  />
                </TabsContent>
                
                <TabsContent value="completed" className="p-3">
                  <AdminOrders 
                    orders={getOrdersByStatus("completed")} 
                    onSelectOrder={onSelectOrder}
                  />
                </TabsContent>
                
                <TabsContent value="cancelled" className="p-3">
                  <AdminOrders 
                    orders={getOrdersByStatus("cancelled")} 
                    onSelectOrder={onSelectOrder}
                  />
                </TabsContent>
                
                <TabsContent value="all" className="p-3">
                  <AdminOrders 
                    orders={sortedOrders} 
                    onSelectOrder={onSelectOrder}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </OrdersLayout>
  );
};

export default AdminOrdersList;
