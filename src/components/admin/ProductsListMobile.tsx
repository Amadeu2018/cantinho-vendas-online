
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Package, Tag, DollarSign, Minus, Plus } from "lucide-react";
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
      <div className="text-center py-12 px-4">
        <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-base">Nenhum produto encontrado</p>
        <p className="text-gray-400 text-sm mt-1">Adicione produtos para começar a vender</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 px-2">
      {products.map((product: any) => (
        <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm touch-manipulation">
          <div className="space-y-4">
            {/* Header com imagem e nome */}
            <div className="flex items-start gap-4">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="h-16 w-16 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                />
              ) : (
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0 border border-gray-200">
                  <Package className="h-6 w-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-gray-900 mb-1 leading-tight">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-3 w-3 text-gray-400" />
                  <span className="text-sm text-gray-500">{getCategoryName(product)}</span>
                </div>
              </div>
            </div>
            
            {/* Preço em destaque */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            </div>
            
            {/* Controle de estoque */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Estoque</span>
                </div>
                <span className={`text-lg font-semibold ${product.stock_quantity <= 0 ? "text-red-500" : "text-gray-900"}`}>
                  {product.stock_quantity || 0}
                </span>
              </div>
              
              {/* Status badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {(product.stock_quantity || 0) <= 0 && (
                  <Badge variant="destructive" className="text-xs px-2 py-1">
                    <Package className="h-3 w-3 mr-1" />
                    Sem Estoque
                  </Badge>
                )}
                {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                  <Badge variant="outline" className="border-amber-500 text-amber-600 text-xs px-2 py-1">
                    <Package className="h-3 w-3 mr-1" />
                    Estoque Baixo
                  </Badge>
                )}
              </div>
              
              {/* Controles de estoque */}
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-10 w-10 p-0 rounded-lg"
                  onClick={() => onUpdateStock(product, -1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-sm text-gray-600">Ajustar</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-10 w-10 p-0 rounded-lg"
                  onClick={() => onUpdateStock(product, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Ações */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onView(product)} 
                className="flex-1 h-10 text-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(product)} 
                className="flex-1 h-10 text-sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="h-10 w-10 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(product.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsListMobile;
