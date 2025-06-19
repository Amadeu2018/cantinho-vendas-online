
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProductImageUpload from "./ProductImageUpload";

interface EditProductProps {
  product: any;
  onSuccess?: () => void;
}

const EditProduct = ({ product, onSuccess }: EditProductProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price?.toString() || "",
    category_id: product.category_id || "",
    stock_quantity: (product.stock_quantity?.toString() || "0"),
    min_stock_quantity: (product.min_stock_quantity?.toString() || "5"),
    unit: product.unit || "unidade",
    image_url: product.image_url || "",
    sku: product.sku || "",
    barcode: product.barcode || "",
    cost: (product.cost?.toString() || "0"),
  });
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
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
          description: "Você precisa estar logado para editar produtos",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare data for submission
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category_id: formData.category_id === "none" || formData.category_id === "" ? null : formData.category_id,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        min_stock_quantity: parseInt(formData.min_stock_quantity) || 5,
        unit: formData.unit,
        image_url: formData.image_url,
        sku: formData.sku || null,
        barcode: formData.barcode || null,
        cost: parseFloat(formData.cost) || 0,
        seller_id: user.id
      };
      
      console.log("Updating product with data:", productData);
      
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id);
      
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso",
      });
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error);
      toast({
        title: "Erro ao atualizar produto",
        description: error.message || "Ocorreu um erro ao tentar atualizar o produto",
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
          <CardTitle className="text-xl sm:text-2xl font-bold">Editar Produto: {product.name}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Nome do Produto *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Bacalhau à Brás"
                    className="h-10"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">Categoria</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleSelectChange("category_id", value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="none">Sem categoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o produto, seus ingredientes, etc."
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            {/* Preços */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Preços</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">Preço de Venda (AOA) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Ex: 12.50"
                    className="h-10"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost" className="text-sm font-medium">Custo (AOA)</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="Ex: 5.00"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Estoque */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Controle de Estoque</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity" className="text-sm font-medium">Quantidade em Estoque</Label>
                  <Input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    placeholder="Ex: 10"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min_stock_quantity" className="text-sm font-medium">Estoque Mínimo</Label>
                  <Input
                    id="min_stock_quantity"
                    name="min_stock_quantity"
                    type="number"
                    value={formData.min_stock_quantity}
                    onChange={handleChange}
                    placeholder="Ex: 5"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-medium">Unidade</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) => handleSelectChange("unit", value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione uma unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unidade">Unidade</SelectItem>
                      <SelectItem value="kg">Quilograma (kg)</SelectItem>
                      <SelectItem value="g">Grama (g)</SelectItem>
                      <SelectItem value="l">Litro (L)</SelectItem>
                      <SelectItem value="ml">Mililitro (ml)</SelectItem>
                      <SelectItem value="porção">Porção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Códigos de Identificação */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Códigos de Identificação</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Ex: ABC-123"
                    className="h-10"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="barcode" className="text-sm font-medium">Código de Barras</Label>
                  <Input
                    id="barcode"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    placeholder="Ex: 1234567890123"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            {/* Imagem do Produto */}
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
                    Salvar Alterações
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onSuccess && onSuccess()}
                className="flex-1 sm:flex-none sm:min-w-[120px] h-11"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
