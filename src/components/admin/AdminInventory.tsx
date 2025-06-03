
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import InventoryList from "./InventoryList";
import InventorySearch from "./InventorySearch";
import LowStockAlerts from "./LowStockAlerts";

type InventoryItem = {
  id: string;
  name: string;
  category_name?: string;
  stock_quantity: number;
  unit: string;
  price: number;
  min_stock_quantity: number;
  category_id?: string;
};

const AdminInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<InventoryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, 
          name, 
          stock_quantity, 
          unit, 
          price, 
          min_stock_quantity,
          category_id,
          categories:categories!products_category_id_fkey(name)
        `)
        .order("name");
      
      if (error) throw error;
      
      console.log("Inventory data:", data);
      
      // Format the data to match our InventoryItem type with proper null checks
      const formattedData = data?.map(item => {
        // Safe category name extraction
        let categoryName = "Sem categoria";
        
        if (item.categories && typeof item.categories === 'object' && item.categories !== null) {
          const categoryData = item.categories as any;
          if (categoryData && typeof categoryData.name === 'string') {
            categoryName = categoryData.name;
          }
        }
        
        return {
          id: item.id || '',
          name: item.name || 'Produto sem nome',
          category_name: categoryName,
          stock_quantity: Number(item.stock_quantity) || 0,
          unit: item.unit || "unidade",
          price: Number(item.price) || 0,
          min_stock_quantity: Number(item.min_stock_quantity) || 5,
          category_id: item.category_id || undefined
        };
      }) || [];
      
      setInventory(formattedData);
    } catch (error: any) {
      console.error("Erro ao buscar inventário:", error);
      toast({
        title: "Erro ao carregar inventário",
        description: error.message || "Não foi possível carregar o inventário",
        variant: "destructive",
      });
      // Set empty array as fallback
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredInventory = inventory.filter(item => 
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm({...item});
  };
  
  const handleSave = async () => {
    if (editForm) {
      try {
        const { error } = await supabase
          .from("products")
          .update({
            stock_quantity: editForm.stock_quantity,
            min_stock_quantity: editForm.min_stock_quantity,
            price: editForm.price
          })
          .eq("id", editForm.id);
        
        if (error) throw error;
        
        // Update local state
        setInventory(inventory.map(item => 
          item.id === editForm.id ? editForm : item
        ));
        
        toast({
          title: "Produto atualizado",
          description: "As alterações foram salvas com sucesso",
        });
        
        // Reset editing state
        setEditingId(null);
        setEditForm(null);
        
      } catch (error: any) {
        console.error("Erro ao atualizar produto:", error);
        toast({
          title: "Erro ao salvar alterações",
          description: error.message || "Ocorreu um erro ao tentar salvar as alterações",
          variant: "destructive",
        });
      }
    }
  };
  
  const openDeleteDialog = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };
  
  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", itemToDelete);
      
      if (error) throw error;
      
      setInventory(inventory.filter(item => item.id !== itemToDelete));
      
      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso",
      });
      
      closeDeleteDialog();
    } catch (error: any) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro ao excluir produto",
        description: error.message || "Ocorreu um erro ao tentar excluir o produto",
        variant: "destructive",
      });
    }
  };
  
  const handleStockChange = async (id: string, change: number) => {
    try {
      const item = inventory.find(item => item.id === id);
      if (!item) return;
      
      const newStock = Math.max(0, item.stock_quantity + change);
      
      // Update in Supabase
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", id);
      
      if (error) throw error;
      
      // Record the stock movement
      const { error: movementError } = await supabase
        .from("stock_movements")
        .insert({
          product_id: id,
          quantity: change,
          type: change > 0 ? "addition" : "reduction",
          reason: change > 0 ? "Manual addition" : "Manual reduction"
        });
      
      if (movementError) console.error("Error recording stock movement:", movementError);
      
      // Update local state
      setInventory(inventory.map(item => 
        item.id === id ? { ...item, stock_quantity: newStock } : item
      ));
      
      toast({
        title: "Estoque atualizado",
        description: `Estoque ${change > 0 ? "aumentado" : "reduzido"} com sucesso`,
      });
      
    } catch (error: any) {
      console.error("Erro ao atualizar estoque:", error);
      toast({
        title: "Erro ao atualizar estoque",
        description: error.message || "Ocorreu um erro ao tentar atualizar o estoque",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <InventorySearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Inventário</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Carregando inventário...</p>
            </div>
          ) : (
            <InventoryList
              inventory={filteredInventory}
              editingId={editingId}
              editForm={editForm}
              onEdit={handleEdit}
              onEditFormChange={setEditForm}
              onSave={handleSave}
              onCancelEdit={() => setEditingId(null)}
              onDelete={openDeleteDialog}
              onStockChange={handleStockChange}
            />
          )}
        </CardContent>
      </Card>
      
      <LowStockAlerts inventory={inventory} />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não poderá ser desfeita."
      />
    </div>
  );
};

export default AdminInventory;
