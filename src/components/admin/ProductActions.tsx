
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductActionsProps {
  onAddProduct: () => void;
}

const ProductActions = ({ onAddProduct }: ProductActionsProps) => {
  return (
    <Button onClick={onAddProduct} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Adicionar Produto
    </Button>
  );
};

export default ProductActions;
