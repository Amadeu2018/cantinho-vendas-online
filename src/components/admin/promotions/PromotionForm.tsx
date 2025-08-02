import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Percent, Save, X } from "lucide-react";

interface PromotionFormProps {
  promotion: any;
  products: any[];
  categories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

const PromotionForm = ({ promotion, products, categories, onSave, onCancel }: PromotionFormProps) => {
  const [formData, setFormData] = useState({
    discount_percentage: "",
    start_date: "",
    end_date: "",
    promotion_type: "percentage",
    applies_to: "product", // product, category, all
    product_id: "",
    applies_to_category_id: "",
    min_quantity: "1"
  });

  useEffect(() => {
    if (promotion) {
      setFormData({
        discount_percentage: promotion.discount_percentage.toString(),
        start_date: promotion.start_date.split('T')[0],
        end_date: promotion.end_date.split('T')[0],
        promotion_type: promotion.promotion_type || "percentage",
        applies_to: promotion.product_id ? "product" : promotion.applies_to_category_id ? "category" : "all",
        product_id: promotion.product_id || "",
        applies_to_category_id: promotion.applies_to_category_id || "",
        min_quantity: promotion.min_quantity?.toString() || "1"
      });
    }
  }, [promotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: any = {
      discount_percentage: parseFloat(formData.discount_percentage),
      start_date: formData.start_date,
      end_date: formData.end_date,
      promotion_type: formData.promotion_type,
      min_quantity: parseInt(formData.min_quantity)
    };

    if (formData.applies_to === "product") {
      data.product_id = formData.product_id;
    } else if (formData.applies_to === "category") {
      data.applies_to_category_id = formData.applies_to_category_id;
    }

    onSave(data);
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5" />
          {promotion ? "Editar Promoção" : "Nova Promoção"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Desconto (%) *</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="100"
                step="0.01"
                value={formData.discount_percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                placeholder="Ex: 15"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Quantidade Mínima</Label>
              <Input
                id="minQuantity"
                type="number"
                min="1"
                value={formData.min_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, min_quantity: e.target.value }))}
                placeholder="Ex: 1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Início *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Data de Fim *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Aplicar Promoção a:</Label>
              <Select
                value={formData.applies_to}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  applies_to: value,
                  product_id: "",
                  applies_to_category_id: ""
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione onde aplicar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Produto Específico</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                  <SelectItem value="all">Todos os Produtos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.applies_to === "product" && (
              <div className="space-y-2">
                <Label>Produto *</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, product_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.applies_to === "category" && (
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select
                  value={formData.applies_to_category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, applies_to_category_id: value }))}
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
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {promotion ? "Atualizar" : "Criar"} Promoção
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromotionForm;