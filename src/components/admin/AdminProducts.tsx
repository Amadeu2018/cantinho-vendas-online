
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
      <div className="space-y-4 p-2 sm:p-4 lg:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg md:text-xl font-semibold">Novo Produto</h2>
          <Button variant="outline" onClick={() => setShowAddForm(false)} className="text-sm md:text-base h-8 md:h-9">
            Voltar para Lista
          </Button>
        </div>
        <AddProduct onSuccess={handleOnSuccess} />
      </div>
    );
  }

  if (showEditForm && selectedProduct) {
    return (
      <div className="space-y-4 p-2 sm:p-4 lg:p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-lg md:text-xl font-semibold">Editar Produto</h2>
          <Button variant="outline" onClick={() => setShowEditForm(false)} className="text-sm md:text-base h-8 md:h-9">
            Voltar para Lista
          </Button>
        </div>
        <EditProduct product={selectedProduct} onSuccess={handleOnSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-2 sm:p-4 lg:p-0">
      <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            className="pl-8 text-sm md:text-base h-9 md:h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ProductActions onAddProduct={() => setShowAddForm(true)} />
      </div>
      
      <Card>
        <CardHeader className="pb-3 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Produtos</CardTitle>
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-4 md:mb-6 overflow-x-auto">
              <TabsList className={`h-auto p-1 bg-gray-100 ${isMobile ? 'w-max flex no-scrollbar' : 'w-full flex-wrap justify-start'} gap-1`}>
                <TabsTrigger value="all" className="text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                  Todos
                </TabsTrigger>
                <TabsTrigger value="low-stock" className="text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                  Estoque Baixo
                </TabsTrigger>
                <TabsTrigger value="out-of-stock" className="text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                  Sem Estoque
                </TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 whitespace-nowrap">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center h-48 md:h-64">
                  <div className="animate-spin h-6 w-6 md:h-8 md:w-8 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
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
