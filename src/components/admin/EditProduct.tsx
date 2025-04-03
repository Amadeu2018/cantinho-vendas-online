
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ImagePlus, Save, Image, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface EditProductProps {
  product: any;
  onSuccess?: () => void;
}

const EditProduct = ({ product, onSuccess }: EditProductProps) => {
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
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
  const [imagePreview, setImagePreview] = useState<string | null>(product.image_url || null);
  const { toast } = useToast();

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Tipo de arquivo inválido",
        description: "Por favor, selecione uma imagem válida",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    setImagePreview(URL.createObjectURL(file));

    // Upload to Supabase Storage
    try {
      setImageUploading(true);
      
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from("products")
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);
      
      // Update form data
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      
      toast({
        title: "Imagem carregada",
        description: "A imagem foi carregada com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao fazer upload da imagem:", error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message || "Ocorreu um erro ao tentar fazer upload da imagem",
        variant: "destructive",
      });
      setImagePreview(product.image_url || null);
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: "" }));
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
      
      // Prepare data for submission
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        stock_quantity: parseInt(formData.stock_quantity),
        min_stock_quantity: parseInt(formData.min_stock_quantity),
        unit: formData.unit,
        image_url: formData.image_url,
        sku: formData.sku,
        barcode: formData.barcode,
        cost: parseFloat(formData.cost),
      };
      
      // Send to Supabase
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", product.id);
      
      if (error) throw error;
      
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso",
      });
      
      // Success callback
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
    <Card>
      <CardHeader>
        <CardTitle>Editar Produto: {product.name}</CardTitle>
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
              <Label htmlFor="price">Preço (€) *</Label>
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
              <Label htmlFor="cost">Custo (€)</Label>
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
                  <SelectItem value="none">Sem categoria</SelectItem>
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
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Imagem do Produto</Label>
              {imagePreview ? (
                <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <Label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    {imageUploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    ) : (
                      <>
                        <ImagePlus className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">
                          Clique para selecionar
                        </span>
                      </>
                    )}
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                  </Label>
                </div>
              )}
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
          
          <div className="flex space-x-4">
            <Button 
              type="submit"
              disabled={loading || imageUploading}
              className="flex-1 md:flex-none"
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
              className="flex-1 md:flex-none"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProduct;
