
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const ProductsListMobile = ({
  products,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
  getCategoryName,
}: any) => {
  if (!products?.length) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-500">Nenhum produto encontrado</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {products.map((product: any) => (
        <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="h-12 w-12 object-cover rounded-md flex-shrink-0"
              />
            ) : (
              <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                <Eye className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              <p className="text-xs text-gray-500 truncate">{getCategoryName(product)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Preço</div>
              <div className="text-sm font-semibold">{formatCurrency(product.price)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Estoque</div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${product.stock_quantity <= 0 ? "text-red-500" : ""}`}>
                  {product.stock_quantity || 0}
                </span>
                {(product.stock_quantity || 0) <= 0 && (
                  <Badge variant="destructive" className="text-xs px-1 py-0">Sem Estoque</Badge>
                )}
                {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                  <Badge variant="outline" className="border-amber-500 text-amber-600 text-xs px-1 py-0">Baixo</Badge>
                )}
              </div>
              <div className="flex gap-1 mt-1">
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
            <Button variant="ghost" size="sm" onClick={() => onView(product)} className="h-7 px-2">
              <Eye className="h-3 w-3 mr-1" />
              <span className="text-xs">Ver</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(product)} className="h-7 px-2">
              <Edit className="h-3 w-3 mr-1" />
              <span className="text-xs">Editar</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 hover:text-red-600 h-7 px-2"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              <span className="text-xs">Excluir</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductsListMobile;
