import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProductsManager from "./products/ProductsManager";
import ProductFormContainer from "./products/ProductFormContainer";
import ProductView from "./ProductView";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import ProductCategoriesManager from "./ProductCategoriesManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminProducts = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showCategoriesManager, setShowCategoriesManager] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const { toast } = useToast();

  const openDeleteDialog = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDelete);

      if (error) throw error;

      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso",
      });

      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro ao excluir produto",
        description: error.message || "Ocorreu um erro ao tentar excluir o produto",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowEditForm(true);
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setShowViewProduct(true);
  };

  const handleOnSuccess = () => {
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const getCategoryName = (product: any) => {
    if (product.categories && product.categories.name) {
      return product.categories.name;
    }
    return "Sem categoria";
  };

  if (showAddForm) {
    return (
      <ProductFormContainer
        mode="add"
        onBack={() => setShowAddForm(false)}
        onSuccess={handleOnSuccess}
      />
    );
  }

  if (showEditForm && selectedProduct) {
    return (
      <ProductFormContainer
        mode="edit"
        selectedProduct={selectedProduct}
        onBack={() => setShowEditForm(false)}
        onSuccess={handleOnSuccess}
      />
    );
  }

  if (showViewProduct && selectedProduct) {
    return (
      <ProductView 
        product={selectedProduct} 
        onBack={() => setShowViewProduct(false)}
        getCategoryName={getCategoryName}
      />
    );
  }

  if (showCategoriesManager) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-3 sm:px-0">
          <h2 className="text-xl font-semibold">Gerenciar Categorias</h2>
          <button 
            onClick={() => setShowCategoriesManager(false)}
            className="text-sm text-blue-600 hover:underline"
          >
            Voltar para Produtos
          </button>
        </div>
        <ProductCategoriesManager />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="mt-4">
          <ProductsManager
            onAddProduct={() => setShowAddForm(true)}
            onEditProduct={handleEditProduct}
            onViewProduct={handleViewProduct}
            onDeleteProduct={openDeleteDialog}
          />
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <ProductCategoriesManager />
        </TabsContent>
      </Tabs>
      
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteProduct}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não poderá ser desfeita."
      />
    </div>
  );
};

export default AdminProducts;
