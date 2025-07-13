import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductActions from "../ProductActions";

interface ProductsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
}

const ProductsHeader = ({ searchTerm, onSearchChange, onAddProduct }: ProductsHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produto..."
          className="pl-8 text-sm h-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <ProductActions onAddProduct={onAddProduct} />
    </div>
  );
};

export default ProductsHeader;