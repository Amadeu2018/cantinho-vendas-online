
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import InventoryList from "./InventoryList";
import LowStockAlerts from "./LowStockAlerts";
import { useStockNotifications } from "@/hooks/admin/use-stock-notifications";

const AdminInventory = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  useStockNotifications();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `)
        .order('name');

      if (error) throw error;

      const processedData = data.map(item => ({
        ...item,
        category_name: item.categories?.name || 'Sem categoria'
      }));

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestão de Inventário</h2>
        <Button onClick={() => window.location.reload()}>
          Atualizar
        </Button>
      </div>

      <LowStockAlerts inventory={inventory} />

      <Card>
        <CardHeader>
          <CardTitle>Produtos em Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryList
            inventory={inventory}
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
