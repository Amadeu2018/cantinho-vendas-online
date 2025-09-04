import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    console.log("🚀 Iniciando carregamento...");
    fetchProducts();
    fetchCategories();
  }, [sortField, sortDirection]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("🔍 Iniciando busca de produtos...");
      
      // Verificar se o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      console.log("👤 Usuário atual:", user?.id);
      
      if (!user) {
        console.error("❌ Usuário não autenticado");
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para ver os produtos",
          variant: "destructive",
        });
        return;
      }

      // Verificar role do usuário
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      console.log("👔 Role do usuário:", profile?.role);

      const { data, error } = await supabase
        .from("products")
        .select("*, categories(id, name)")
        .order(sortField, { ascending: sortDirection === "asc" });

      console.log("🔍 Query executada");
      console.log("📊 Dados recebidos:", data);
      console.log("❗ Erro recebido:", error);

      if (error) {
        console.error("❌ Erro na query:", error);
        toast({
          title: "Erro ao carregar produtos",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      console.log("✅ Produtos carregados com sucesso:", data?.length || 0);
      console.log("📝 Produtos:", data);
      setProducts(data || []);
    } catch (error: any) {
      console.error("❌ Erro geral:", error);
      toast({
        title: "Erro ao carregar produtos", 
        description: "Não foi possível carregar a lista de produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log("🔍 Carregando categorias...");
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) {
        console.error("❌ Erro categorias:", error);
        return;
      }
      
      console.log("✅ Categorias carregadas:", data?.length || 0);
      setCategories(data || []);
    } catch (error: any) {
      console.error("❌ Erro categorias:", error);
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
    const category = categories.find(cat => cat.id === product.category_id);
    return category?.name || "Sem categoria";
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

  console.log("📊 Estado atual do componente:", {
    loading,
    products: products.length,
    filteredProducts: filteredProducts.length,
    activeTab,
    searchTerm,
    categoriesLoaded: categories.length
  });

  // Debug adicional dos produtos
  if (products.length > 0) {
    console.log("🔍 Primeiros 3 produtos:", products.slice(0, 3));
  }

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
          
          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin h-6 w-6 border-4 border-cantinho-terracotta border-opacity-50 border-t-cantinho-terracotta rounded-full"></div>
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-500 mb-4">
                  Exibindo {filteredProducts.length} de {products.length} produtos
                </div>
                {filteredProducts.length > 0 ? (
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
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum produto encontrado</p>
                    {products.length > 0 && (
                      <p className="text-sm text-gray-400">Verifique os filtros aplicados</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsManager;