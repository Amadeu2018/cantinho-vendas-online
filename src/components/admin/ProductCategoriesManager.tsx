
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

const ProductCategoriesManager = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar categorias:", error);
      toast({
        title: "Erro ao carregar categorias",
        description: error.message || "Não foi possível carregar a lista de categorias",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "O nome da categoria é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({ name: newCategory.trim() })
        .select();

      if (error) throw error;

      setCategories([...categories, data[0]]);
      setNewCategory("");
      
      toast({
        title: "Categoria adicionada",
        description: "A categoria foi adicionada com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao adicionar categoria:", error);
      toast({
        title: "Erro ao adicionar categoria",
        description: error.message || "Ocorreu um erro ao tentar adicionar a categoria",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || !editingId) return;

    try {
      const { error } = await supabase
        .from("categories")
        .update({ name: editName.trim() })
        .eq("id", editingId);

      if (error) throw error;

      setCategories(categories.map(cat => 
        cat.id === editingId ? { ...cat, name: editName.trim() } : cat
      ));
      
      setEditingId(null);
      setEditName("");
      
      toast({
        title: "Categoria atualizada",
        description: "A categoria foi atualizada com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar categoria:", error);
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message || "Ocorreu um erro ao tentar atualizar a categoria",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      // Check if there are products using this category
      const { data: products, error: checkError } = await supabase
        .from("products")
        .select("id")
        .eq("category_id", categoryToDelete);

      if (checkError) throw checkError;

      if (products && products.length > 0) {
        toast({
          title: "Não é possível excluir",
          description: `Esta categoria está sendo utilizada por ${products.length} produto(s)`,
          variant: "destructive",
        });
        closeDeleteDialog();
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryToDelete);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      
      toast({
        title: "Categoria excluída",
        description: "A categoria foi excluída com sucesso",
      });
      
      closeDeleteDialog();
    } catch (error: any) {
      console.error("Erro ao excluir categoria:", error);
      toast({
        title: "Erro ao excluir categoria",
        description: error.message || "Ocorreu um erro ao tentar excluir a categoria",
        variant: "destructive",
      });
      closeDeleteDialog();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias de Produtos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Nova categoria..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <p>Carregando categorias...</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          {editingId === category.id ? (
                            <div className="flex space-x-2">
                              <Input
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="flex-1"
                              />
                              <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setEditingId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            category.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId !== category.id && (
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleEdit(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-500 hover:text-red-600"
                                onClick={() => openDeleteDialog(category.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-4">
                        Nenhuma categoria encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          title="Excluir categoria"
          description="Tem certeza que deseja excluir esta categoria? Esta ação não poderá ser desfeita."
        />
      </CardContent>
    </Card>
  );
};

export default ProductCategoriesManager;
