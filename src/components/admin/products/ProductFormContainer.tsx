import { Button } from "@/components/ui/button";
import AddProduct from "../AddProduct";
import EditProduct from "../EditProduct";

interface ProductFormContainerProps {
  mode: 'add' | 'edit';
  selectedProduct?: any;
  onBack: () => void;
  onSuccess: () => void;
}

const ProductFormContainer = ({ mode, selectedProduct, onBack, onSuccess }: ProductFormContainerProps) => {
  const title = mode === 'add' ? 'Novo Produto' : 'Editar Produto';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-3 sm:px-0">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button variant="outline" onClick={onBack} className="text-sm h-9">
          Voltar para Lista
        </Button>
      </div>
      
      {mode === 'add' ? (
        <AddProduct onSuccess={onSuccess} />
      ) : (
        <EditProduct product={selectedProduct} onSuccess={onSuccess} />
      )}
    </div>
  );
};

export default ProductFormContainer;