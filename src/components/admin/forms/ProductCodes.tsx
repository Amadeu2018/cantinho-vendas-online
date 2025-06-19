
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductCodesProps {
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductCodes = ({ formData, onChange }: ProductCodesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Códigos de Identificação</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={onChange}
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
            onChange={onChange}
            placeholder="Ex: 1234567890123"
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCodes;
