
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductPricingProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductPricing = ({ formData, onChange }: ProductPricingProps) => {
  return (
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
            onChange={onChange}
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
            onChange={onChange}
            placeholder="Ex: 5.00"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPricing;
