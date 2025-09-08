
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import InventoryList from "./InventoryList";
import LowStockAlerts from "./LowStockAlerts";
import InventorySearch from "./InventorySearch";
import AddProduct from "./AddProduct";
import { useStockNotifications } from "@/hooks/admin/use-stock-notifications";
import { useIsMobile, useIsMobileOrTablet } from "@/hooks/use-mobile";
import { RefreshCw, Plus, AlertTriangle, ArrowLeft } from "lucide-react";

const AdminInventory = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isMobileOrTablet = useIsMobileOrTablet();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);

  useStockNotifications();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // Get products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (productsError) throw productsError;

      // Get categories separately
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) throw categoriesError;

      // Combine the data
      const processedData = (productsData || []).map(product => {
        const category = categoriesData?.find(cat => cat.id === product.category_id);
        return {
          ...product,
          category_name: category?.name || 'Sem categoria'
        };
      });

      setInventory(processedData);
    } catch (error: any) {
      console.error('Erro ao buscar inventário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o inventário",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditForm({
      stock_quantity: item.stock_quantity,
      min_stock_quantity: item.min_stock_quantity,
      price: item.price
    });
  };

  const handleSave = async () => {
    if (!editingId || !editForm) return;

    try {
      const { error } = await supabase
        .from('products')
        .update(editForm)
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso",
      });

      setEditingId(null);
      setEditForm(null);
      fetchInventory();
    } catch (error: any) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto",
        variant: "destructive"
      });
    }
  };

  const handleStockChange = async (productId: string, change: number) => {
    try {
      const product = inventory.find(p => p.id === productId);
      if (!product) return;

      const newStock = Math.max(0, product.stock_quantity + change);

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', productId);

      if (error) throw error;

      fetchInventory();
    } catch (error: any) {
      console.error('Erro ao atualizar estoque:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o estoque",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso",
      });

      fetchInventory();
    } catch (error: any) {
      console.error('Erro ao remover produto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o produto",
        variant: "destructive"
      });
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.stock_quantity <= item.min_stock_quantity);

  const handleAddProductSuccess = () => {
    setShowAddProduct(false);
    fetchInventory();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (showAddProduct) {
    return (
      <div className="space-y-4 p-2 sm:p-0">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowAddProduct(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Estoque
          </Button>
        </div>
        <AddProduct onSuccess={handleAddProductSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Header Mobile-Optimized */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-cantinho-terracotta" />
            Estoque
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {inventory.length} produtos • {lowStockItems.length} alertas
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <InventorySearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
          />
          <Button 
            onClick={() => setShowAddProduct(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </Button>
          <Button 
            onClick={fetchInventory}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isMobile ? "Atualizar" : "Atualizar"}
          </Button>
        </div>
      </div>

      {/* Low Stock Alerts - Mobile Optimized */}
      {lowStockItems.length > 0 && (
        <LowStockAlerts inventory={inventory} />
      )}

      {/* Inventory List */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center justify-between">
            <span>Produtos em Estoque</span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredInventory.length} itens
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <InventoryList
            inventory={filteredInventory}
            editingId={editingId}
            editForm={editForm}
            onEdit={handleEdit}
            onEditFormChange={setEditForm}
            onSave={handleSave}
            onCancelEdit={() => {
              setEditingId(null);
              setEditForm(null);
            }}
            onDelete={handleDelete}
            onStockChange={handleStockChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventory;
