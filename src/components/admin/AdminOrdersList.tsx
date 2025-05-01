
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminOrders from "./AdminOrders";
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
    
    // Search in customer info
    const customerName = order.customerInfo?.name?.toLowerCase() || '';
    
    // Search in order ID (partial match)
    const orderId = order.id?.toLowerCase() || '';
    
    // Search in any item names
    const itemNames = order.items?.map((item: any) => 
      item.name?.toLowerCase() || ''
    ).join(' ') || '';
    
    return (
      customerName.includes(searchLower) ||
      orderId.includes(searchLower) ||
      itemNames.includes(searchLower)
    );
  });
  
  // Sort orders
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
  
  // Filter orders by status and apply sort
  const getOrdersByStatus = (status: string) => {
    if (status === "all") return sortedOrders;
    return sortedOrders.filter(order => order.status === status);
  };

  return (
    <div>
      {fetchingOrders ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Carregando pedidos...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search and sort controls */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar pedidos..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
              <SelectTrigger className="w-full md:w-[180px]">
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
              className="w-full md:w-auto"
              onClick={() => {
                setSearchTerm("");
                setSortOrder("newest");
              }}
            >
              Limpar filtros
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className={`w-full ${isMobile ? 'overflow-x-auto flex no-scrollbar' : ''}`}>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
                <TabsTrigger value="preparing">Em Preparo</TabsTrigger>
                <TabsTrigger value="delivering">Em Entrega</TabsTrigger>
                <TabsTrigger value="completed">Concluídos</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-4">
                <AdminOrders 
                  orders={getOrdersByStatus("pending")} 
                  onSelectOrder={onSelectOrder}
                />
              </TabsContent>
              
              <TabsContent value="confirmed" className="mt-4">
                <AdminOrders 
                  orders={getOrdersByStatus("confirmed")} 
                  onSelectOrder={onSelectOrder}
                />
              </TabsContent>
              
              <TabsContent value="preparing" className="mt-4">
                <AdminOrders 
                  orders={getOrdersByStatus("preparing")} 
                  onSelectOrder={onSelectOrder}
                />
              </TabsContent>
              
              <TabsContent value="delivering" className="mt-4">
                <AdminOrders 
                  orders={getOrdersByStatus("delivering")} 
                  onSelectOrder={onSelectOrder}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="mt-4">
                <AdminOrders 
                  orders={getOrdersByStatus("completed")} 
                  onSelectOrder={onSelectOrder}
                />
              </TabsContent>
              
              <TabsContent value="cancelled" className="mt-4">
                <AdminOrders 
                  orders={getOrdersByStatus("cancelled")} 
                  onSelectOrder={onSelectOrder}
                />
              </TabsContent>
              
              <TabsContent value="all" className="mt-4">
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
  );
};

export default AdminOrdersList;
