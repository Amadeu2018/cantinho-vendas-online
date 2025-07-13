import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductsMobileViewProps {
  products: any[];
  onView: (product: any) => void;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onUpdateStock: (product: any, change: number) => void;
  getCategoryName: (product: any) => string;
}

const ProductsMobileView = ({
  products,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
  getCategoryName
}: ProductsMobileViewProps) => {
  return (
    <div className="space-y-3 md:space-y-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.id} className="mobile-card-view bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-14 w-14 md:h-16 md:w-16 object-cover rounded-md flex-shrink-0"
                />
              ) : (
                <div className="h-14 w-14 md:h-16 md:w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                  <Eye className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm md:text-base text-gray-900 truncate">{product.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">{getCategoryName(product)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="mobile-card-label text-xs text-gray-500 mb-1">Preço</div>
                <div className="mobile-card-value text-sm md:text-base font-medium">{formatCurrency(product.price)}</div>
              </div>
              <div>
                <div className="mobile-card-label text-xs text-gray-500 mb-1">Estoque</div>
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className={`mobile-card-value text-sm md:text-base font-medium ${product.stock_quantity <= 0 ? "text-red-500" : ""}`}>
                      {product.stock_quantity || 0} {product.unit || "unidade"}
                    </span>
                    <div className="flex gap-1 mt-1">
                      {(product.stock_quantity || 0) <= 0 && (
                        <Badge variant="destructive" className="text-xs px-1 py-0">Sem Estoque</Badge>
                      )}
                      {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                        <Badge variant="outline" className="text-xs px-1 py-0 border-amber-500 text-amber-600">Baixo</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-xs"
                    onClick={() => onUpdateStock(product, -1)}>
                    -
                  </Button>
                  <Button size="sm" variant="outline" className="h-6 w-6 p-0 text-xs"
                    onClick={() => onUpdateStock(product, 1)}>
                    +
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-1 border-t pt-3">
              <Button variant="ghost" size="sm" onClick={() => onView(product)} className="text-xs h-7 px-2">
                <Eye className="h-3 w-3 mr-1" />Ver
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="text-xs h-7 px-2">
                <Edit className="h-3 w-3 mr-1" />Editar
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-600 text-xs h-7 px-2"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />Excluir
              </Button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 md:py-12">
          <p className="text-sm md:text-base text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}
    </div>
  );
};

export default ProductsMobileView;