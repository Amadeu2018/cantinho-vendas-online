import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProductImageUpload from "./ProductImageUpload";
import ProductBasicInfo from "./forms/ProductBasicInfo";
import ProductPricing from "./forms/ProductPricing";
import ProductInventory from "./forms/ProductInventory";
import ProductCodes from "./forms/ProductCodes";

interface AddProductProps {
  onSuccess?: () => void;
}

const AddProduct = ({ onSuccess }: AddProductProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock_quantity: "0",
    min_stock_quantity: "5",
    unit: "unidade",
    image_url: "",
    sku: "",
    barcode: "",
    cost: "0"
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
    ensureBasicCategoriesExist();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  // Ensure we have basic categories for appetizers, main dishes, and desserts
  const ensureBasicCategoriesExist = async () => {
    const basicCategories = [
      { name: "Entradas", description: "Appetizers and starters" },
      { name: "Pratos Principais", description: "Main dishes" },
      { name: "Sobremesas", description: "Desserts and sweets" }
    ];

    try {
      // Get existing categories
      const { data: existingCategories, error: fetchError } = await supabase
        .from("categories")
        .select("name");

      if (fetchError) throw fetchError;

      // Check which basic categories don't exist yet
      const existingNames = existingCategories?.map(c => c.name.toLowerCase()) || [];
      const categoriesToAdd = basicCategories.filter(c => 
        !existingNames.includes(c.name.toLowerCase())
      );

      // Add missing categories
      if (categoriesToAdd.length > 0) {
        const { error: insertError } = await supabase
          .from("categories")
          .insert(categoriesToAdd);

        if (insertError) throw insertError;
        
        // Refresh categories
        fetchCategories();
      }
    } catch (error) {
      console.error("Error ensuring basic categories exist:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Basic validation
      if (!formData.name || !formData.price) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome e preço são obrigatórios",
          variant: "destructive",
        });
        return;
      }
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você precisa estar logado para adicionar produtos",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare data for submission
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category_id: formData.category_id === "null" || formData.category_id === "" ? null : formData.category_id,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        min_stock_quantity: parseInt(formData.min_stock_quantity) || 5,
        unit: formData.unit || "unidade",
        image_url: formData.image_url || '/placeholder.svg',
        sku: formData.sku || null,
        barcode: formData.barcode || null,
        cost: parseFloat(formData.cost) || 0,
        seller_id: user.id
      };
      
      console.log("Sending product data:", productData);
      
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select();
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Product created:", data);
      
      toast({
        title: "Produto adicionado",
        description: "O produto foi adicionado com sucesso",
      });
      
      // Clear form
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: "",
        stock_quantity: "0",
        min_stock_quantity: "5",
        unit: "unidade",
        image_url: "",
        sku: "",
        barcode: "",
        cost: "0"
      });
      
      // Force refresh after small delay to ensure data is updated
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 500);
      
    } catch (error: any) {
      console.error("Erro ao adicionar produto:", error);
      toast({
        title: "Erro ao adicionar produto",
        description: error.message || "Ocorreu um erro ao tentar adicionar o produto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-3 sm:p-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl font-bold">Adicionar Novo Produto</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ProductBasicInfo
              formData={formData}
              categories={categories}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
            />

            <ProductPricing
              formData={formData}
              onChange={handleChange}
            />

            <ProductInventory
              formData={formData}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
            />

            <ProductCodes
              formData={formData}
              onChange={handleChange}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Imagem do Produto</h3>
              <ProductImageUpload
                currentImageUrl={formData.image_url}
                onImageChange={handleImageChange}
                disabled={loading}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button 
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none sm:min-w-[160px] h-11"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Produto
                  </>
                )}
              </Button>
              
              {onSuccess && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onSuccess}
                  className="flex-1 sm:flex-none sm:min-w-[120px] h-11"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
