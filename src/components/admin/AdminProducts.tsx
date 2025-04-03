
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Use a more explicit join query to avoid ambiguity
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories:category_id(id, name)
        `)
        .order(sortField, { ascending: sortDirection === "asc" });

      if (error) throw error;
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

      // Update product list
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
    // In a real app, you'd probably navigate to a product detail page
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
    // Re-fetch with new sort
    fetchProducts();
  };

  const handleUpdateStock = async (product: any, change: number) => {
    const newStock = Math.max(0, (product.stock_quantity || 0) + change);
    
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", product.id);
        
      if (error) throw error;
      
      // Update local products state
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
    const category = categories.find(c => c.id === product.category_id);
    return category ? category.name : "Sem categoria";
  };

  const handleOnSuccess = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    fetchProducts();
  };

  const filteredProducts = products.filter(product => {
    // Filter by search term
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tab/category
    let matchesTab = true;
    if (activeTab === "low-stock") {
      matchesTab = (product.stock_quantity || 0) <= (product.min_stock_quantity || 5);
    } else if (activeTab === "out-of-stock") {
      matchesTab = (product.stock_quantity || 0) <= 0;
    } else if (activeTab !== "all") {
      // If the tab is a category ID
      matchesTab = product.category_id === activeTab;
    }
    
    return matchesSearch && matchesTab;
  });

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {showAddForm ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Novo Produto</h2>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Voltar para Lista
            </Button>
          </div>
          <AddProduct onSuccess={handleOnSuccess} />
        </div>
      ) : showEditForm && selectedProduct ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Editar Produto</h2>
            <Button variant="outline" onClick={() => setShowEditForm(false)}>
              Voltar para Lista
            </Button>
          </div>
          <EditProduct product={selectedProduct} onSuccess={handleOnSuccess} />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Produto
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 w-full overflow-x-auto">
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
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Imagem</TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSort("name")}
                            >
                              <div className="flex items-center">
                                Nome
                                <SortIcon field="name" />
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSort("price")}
                            >
                              <div className="flex items-center">
                                Preço
                                <SortIcon field="price" />
                              </div>
                            </TableHead>
                            <TableHead 
                              className="cursor-pointer"
                              onClick={() => handleSort("stock_quantity")}
                            >
                              <div className="flex items-center">
                                Estoque
                                <SortIcon field="stock_quantity" />
                              </div>
                            </TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  {product.image_url ? (
                                    <img 
                                      src={product.image_url} 
                                      alt={product.name} 
                                      className="h-12 w-12 object-cover rounded-md"
                                    />
                                  ) : (
                                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                      <Eye className="h-6 w-6" />
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                      <span className={product.stock_quantity <= 0 ? "text-red-500" : ""}>
                                        {product.stock_quantity || 0}
                                      </span>
                                      <span className="ml-1">{product.unit || "unidade"}</span>
                                      {(product.stock_quantity || 0) <= 0 && (
                                        <Badge variant="destructive" className="ml-2">Sem Estoque</Badge>
                                      )}
                                      {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                                        <Badge variant="outline" className="ml-2 border-amber-500 text-amber-600">Estoque Baixo</Badge>
                                      )}
                                    </div>
                                    
                                    <div className="flex space-x-1 ml-2">
                                      <Button size="sm" variant="outline" className="h-7 w-7 p-0"
                                        onClick={() => handleUpdateStock(product, -1)}>
                                        -
                                      </Button>
                                      <Button size="sm" variant="outline" className="h-7 w-7 p-0"
                                        onClick={() => handleUpdateStock(product, 1)}>
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{getCategoryName(product)}</TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleViewProduct(product)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                    onClick={() => openDeleteDialog(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                {searchTerm ? (
                                  <p>Nenhum produto encontrado para "{searchTerm}"</p>
                                ) : (
                                  <p>Nenhum produto cadastrado nesta categoria</p>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

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
