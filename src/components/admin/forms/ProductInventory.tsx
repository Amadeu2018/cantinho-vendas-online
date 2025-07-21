
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductInventoryProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const ProductInventory = ({ formData, onChange, onSelectChange }: ProductInventoryProps) => {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
            placeholder="Ex: 5"
            className="h-10"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit" className="text-sm font-medium">Unidade</Label>
          <Select
            value={formData.unit}
            onValueChange={(value) => onSelectChange("unit", value)}
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
  );
};

export default ProductInventory;
