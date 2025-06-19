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
      
      if (onSuccess) onSuccess();
      
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
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Novo Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Bacalhau à Brás"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço (AOA) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 12.50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cost">Custo (AOA)</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                placeholder="Ex: 5.00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleSelectChange("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="null">Sem categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock_quantity">Quantidade em Estoque</Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleChange}
                placeholder="Ex: 10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_stock_quantity">Estoque Mínimo</Label>
              <Input
                id="min_stock_quantity"
                name="min_stock_quantity"
                type="number"
                value={formData.min_stock_quantity}
                onChange={handleChange}
                placeholder="Ex: 5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Ex: ABC-123"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Ex: 1234567890123"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleSelectChange("unit", value)}
              >
                <SelectTrigger>
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
            
            <div className="space-y-2 md:col-span-2">
              <ProductImageUpload
                currentImageUrl={formData.image_url}
                onImageChange={handleImageChange}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o produto, seus ingredientes, etc."
              rows={4}
            />
          </div>
          
          <Button 
            type="submit"
            disabled={loading}
            className="w-full md:w-auto"
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
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProduct;
