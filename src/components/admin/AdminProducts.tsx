import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsList from "./ProductsList";
import ProductActions from "./ProductActions";
import ProductsListMobile from "./ProductsListMobile";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [sortField, sortDirection]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories:categories!products_category_id_fkey(id, name)
        `)
        .order(sortField, { ascending: sortDirection === "asc" });

      if (error) throw error;
      console.log("Fetched products:", data);
      setProducts(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: error.message || "Não foi possível carregar a lista de produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const openDeleteDialog = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
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

      setProducts(products.filter(product => product.id !== productToDelete));
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

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setShowEditForm(true);
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    toast({
      title: "Visualizar produto",
      description: `Visualizando detalhes de: ${product.name}`,
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleUpdateStock = async (product: any, change: number) => {
    const newStock = Math.max(0, (product.stock_quantity || 0) + change);
    
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", product.id);
        
      if (error) throw error;
      
      setProducts(products.map(p => 
        p.id === product.id ? {...p, stock_quantity: newStock} : p
      ));
      
      toast({
        title: "Estoque atualizado",
        description: `Estoque de ${product.name} atualizado para ${newStock}`,
      });
    } catch (error: any) {
      console.error("Erro ao atualizar estoque:", error);
      toast({
        title: "Erro ao atualizar estoque",
        description: error.message || "Ocorreu um erro ao atualizar o estoque",
        variant: "destructive",
      });
    }
  };

  const getCategoryName = (product: any) => {
    if (product.categories && product.categories.name) {
      return product.categories.name;
    }
    return "Sem categoria";
  };

  const handleOnSuccess = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    fetchProducts();
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === "low-stock") {
      matchesTab = (product.stock_quantity || 0) <= (product.min_stock_quantity || 5);
    } else if (activeTab === "out-of-stock") {
      matchesTab = (product.stock_quantity || 0) <= 0;
    } else if (activeTab !== "all") {
      matchesTab = product.category_id === activeTab;
    }
    
    return matchesSearch && matchesTab;
  });

  if (showAddForm) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Novo Produto</h2>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Voltar para Lista
          </Button>
        </div>
        <AddProduct onSuccess={handleOnSuccess} />
      </div>
    );
  }

  if (showEditForm && selectedProduct) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Editar Produto</h2>
          <Button variant="outline" onClick={() => setShowEditForm(false)}>
            Voltar para Lista
          </Button>
        </div>
        <EditProduct product={selectedProduct} onSuccess={handleOnSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative md:w-72 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ProductActions onAddProduct={() => setShowAddForm(true)} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 w-full overflow-x-auto flex no-scrollbar gap-2">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="low-stock">Estoque Baixo</TabsTrigger>
              <TabsTrigger value="out-of-stock">Sem Estoque</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Carregando produtos...</p>
                </div>
              ) : (
                isMobile ? (
                  <ProductsListMobile
                    products={filteredProducts}
                    onView={handleViewProduct}
                    onEdit={handleEditProduct}
                    onDelete={openDeleteDialog}
                    onUpdateStock={handleUpdateStock}
                    getCategoryName={getCategoryName}
                  />
                ) : (
                  <ProductsList 
                    products={filteredProducts}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    onView={handleViewProduct}
                    onEdit={handleEditProduct}
                    onDelete={openDeleteDialog}
                    onUpdateStock={handleUpdateStock}
                    getCategoryName={getCategoryName}
                  />
                )
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteProduct}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não poderá ser desfeita."
      />
    </div>
  );
};

export default AdminProducts;
