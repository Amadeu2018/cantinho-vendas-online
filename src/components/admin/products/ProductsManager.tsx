import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductsList from "../ProductsList";
import ProductsHeader from "./ProductsHeader";
import ProductsFilters from "./ProductsFilters";

interface ProductsManagerProps {
  onAddProduct: () => void;
  onEditProduct: (product: any) => void;
  onViewProduct: (product: any) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductsManager = ({
  onAddProduct,
  onEditProduct,
  onViewProduct,
  onDeleteProduct
}: ProductsManagerProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  const refreshProducts = () => {
    fetchProducts();
  };

  // Add refresh after product operations with dependency optimization
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts();
    }, 30000); // Refresh every 30 seconds (less aggressive)

    return () => clearInterval(interval);
  }, []); // Remove dependencies to prevent unnecessary refreshes

  return (
    <div className="space-y-4 p-3 sm:p-0">
      <ProductsHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddProduct={onAddProduct}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Produtos</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <ProductsFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            categories={categories}
            isMobile={isMobile}
          />
          
          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin h-6 w-6 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
              </div>
            ) : (
              <ProductsList 
                products={filteredProducts}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onView={onViewProduct}
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
                onUpdateStock={handleUpdateStock}
                getCategoryName={getCategoryName}
              />
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsManager;