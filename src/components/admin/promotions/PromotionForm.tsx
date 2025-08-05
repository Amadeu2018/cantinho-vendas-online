import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PromotionFormProps {
  promotion?: any;
  products: any[];
  categories: any[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

const PromotionForm = ({ promotion, products, categories, onSave, onCancel }: PromotionFormProps) => {
  const [formData, setFormData] = useState({
    discount_percentage: promotion?.discount_percentage || 0,
    start_date: promotion?.start_date || '',
    end_date: promotion?.end_date || '',
    promotion_type: promotion?.promotion_type || 'percentage',
    product_id: promotion?.product_id || '',
    applies_to_category_id: promotion?.applies_to_category_id || '',
    min_quantity: promotion?.min_quantity || 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      product_id: formData.product_id || null,
      applies_to_category_id: formData.applies_to_category_id || null,
    };
    
    onSave(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {promotion ? 'Editar Promoção' : 'Nova Promoção'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Desconto (%)</Label>
              <Input
                id="discount"
                type="number"
                min="1"
                max="100"
                value={formData.discount_percentage}
                onChange={(e) => setFormData({...formData, discount_percentage: Number(e.target.value)})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="min_quantity">Quantidade Mínima</Label>
              <Input
                id="min_quantity"
                type="number"
                min="1"
                value={formData.min_quantity}
                onChange={(e) => setFormData({...formData, min_quantity: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data de Início</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end_date">Data de Fim</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Produto Específico (opcional)</Label>
              <Select value={formData.product_id} onValueChange={(value) => setFormData({...formData, product_id: value, applies_to_category_id: ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum produto específico</SelectItem>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Categoria (opcional)</Label>
              <Select value={formData.applies_to_category_id} onValueChange={(value) => setFormData({...formData, applies_to_category_id: value, product_id: ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma categoria específica</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {promotion ? 'Atualizar' : 'Criar'} Promoção
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromotionForm;