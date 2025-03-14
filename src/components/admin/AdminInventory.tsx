
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

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
          categories:category_id(name)
        `)
        .order("name");
      
      if (error) throw error;
      
      // Format the data to match our InventoryItem type
      const formattedData = data?.map(item => {
        let categoryName = "Sem categoria";
        
        // Safely extract the category name
        if (item.categories && typeof item.categories === 'object' && item.categories !== null) {
          categoryName = (item.categories as any).name || "Sem categoria";
        }
        
        return {
          id: item.id,
          name: item.name,
          category_name: categoryName,
          stock_quantity: item.stock_quantity || 0,
          unit: item.unit || "unidade",
          price: item.price || 0,
          min_stock_quantity: item.min_stock_quantity || 5,
          category_id: item.category_id
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
    } finally {
      setLoading(false);
    }
  };
  
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar item..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      {editingId === item.id ? (
                        <>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editForm?.stock_quantity}
                                onChange={(e) => setEditForm({...editForm!, stock_quantity: parseInt(e.target.value) || 0})}
                                className="w-20"
                              />
                              <span>{item.unit}</span>
                              <Input
                                type="number"
                                value={editForm?.min_stock_quantity}
                                onChange={(e) => setEditForm({...editForm!, min_stock_quantity: parseInt(e.target.value) || 0})}
                                className="w-20 ml-2"
                                placeholder="Alerta min."
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={editForm?.price}
                              onChange={(e) => setEditForm({...editForm!, price: parseFloat(e.target.value) || 0})}
                              className="w-24"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={handleSave} className="mr-2">
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              Cancelar
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={`${item.stock_quantity <= item.min_stock_quantity ? "text-red-500 font-bold" : ""}`}>
                                {item.stock_quantity}
                              </span>
                              <span>{item.unit}</span>
                              {item.stock_quantity <= item.min_stock_quantity && (
                                <Badge variant="destructive" className="ml-2">Baixo</Badge>
                              )}
                              <div className="flex gap-1 ml-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleStockChange(item.id, -1)}
                                >
                                  -
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleStockChange(item.id, 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>
                            <Button 
                              size="sm"
                              variant="ghost" 
                              onClick={() => handleEdit(item)}
                              className="mr-2"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => openDeleteDialog(item.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Nenhum item encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory
              .filter(item => item.stock_quantity <= item.min_stock_quantity)
              .map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-md">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold">{item.stock_quantity} {item.unit}</p>
                    <p className="text-sm text-gray-500">Alerta: {item.min_stock_quantity}</p>
                  </div>
                </div>
              ))}
            
            {inventory.filter(item => item.stock_quantity <= item.min_stock_quantity).length === 0 && (
              <p className="text-center py-4 text-green-600">
                Nenhum item com estoque baixo
              </p>
            )}
          </div>
        </CardContent>
      </Card>

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
