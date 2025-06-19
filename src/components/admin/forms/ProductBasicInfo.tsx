
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductBasicInfoProps {
  formData: any;
  categories: any[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const ProductBasicInfo = ({ formData, categories, onChange, onSelectChange }: ProductBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações Básicas</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Nome do Produto *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Ex: Bacalhau à Brás"
            className="h-10"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">Categoria</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => onSelectChange("category_id", value)}
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
              <SelectItem value="null">Sem categoria</SelectItem>
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
          onChange={onChange}
          placeholder="Descreva o produto, seus ingredientes, etc."
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );
};

export default ProductBasicInfo;
