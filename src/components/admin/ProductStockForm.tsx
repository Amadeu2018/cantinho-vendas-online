
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ProductStockFormProps {
  productId: string;
  currentStock: number;
  productName: string;
  onSuccess?: () => void;
}

const ProductStockForm = ({ productId, currentStock, productName, onSuccess }: ProductStockFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: "1",
    type: "addition",
    reason: "",
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Basic validation
      if (!formData.quantity || !formData.reason) {
        toast({
          title: "Campos obrigatórios",
          description: "Quantidade e motivo são obrigatórios",
          variant: "destructive",
        });
        return;
      }
      
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        toast({
          title: "Quantidade inválida",
          description: "A quantidade deve ser um número positivo",
          variant: "destructive",
        });
        return;
      }
      
      // Calculate new stock quantity
      const change = formData.type === "addition" ? quantity : -quantity;
      const newStock = Math.max(0, currentStock + change);
      
      // Update product stock
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", productId);
      
      if (updateError) throw updateError;
      
      // Record stock movement
      const { error: movementError } = await supabase
        .from("stock_movements")
        .insert({
          product_id: productId,
          quantity: change,
          type: formData.type,
          reason: formData.reason
        });
      
      if (movementError) throw movementError;
      
      toast({
        title: "Estoque atualizado",
        description: `O estoque de ${productName} foi ${formData.type === "addition" ? "aumentado" : "reduzido"} com sucesso`,
      });
      
      // Reset form
      setFormData({
        quantity: "1",
        type: "addition",
        reason: "",
      });
      
      // Callback
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Erro ao atualizar estoque:", error);
      toast({
        title: "Erro ao atualizar estoque",
        description: error.message || "Ocorreu um erro ao tentar atualizar o estoque",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajustar Estoque: {productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Movimento *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="addition">Entrada</SelectItem>
                  <SelectItem value="reduction">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo *</Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Ex: Compra de fornecedor, Ajuste de inventário..."
              rows={3}
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                "Confirmar Movimento"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductStockForm;
