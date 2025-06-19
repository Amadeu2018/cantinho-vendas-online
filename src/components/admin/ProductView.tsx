
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Tag, DollarSign, Calendar, Hash, BarChart3 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductViewProps {
  product: any;
  onBack: () => void;
  getCategoryName: (product: any) => string;
}

const ProductView = ({ product, onBack, getCategoryName }: ProductViewProps) => {
  return (
    <div className="space-y-4 p-3 sm:p-0">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h2 className="text-lg font-semibold">Detalhes do Produto</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Imagem do Produto */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <div className="aspect-square w-full max-w-sm mx-auto">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações Principais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-start justify-between gap-3">
              <span className="text-xl font-bold">{product.name}</span>
              <div className="flex flex-wrap gap-2">
                {(product.stock_quantity || 0) <= 0 && (
                  <Badge variant="destructive">Sem Estoque</Badge>
                )}
                {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                  <Badge variant="outline" className="border-amber-500 text-amber-600">
                    Estoque Baixo
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preço e Categoria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>Preço de Venda</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(product.price)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="h-4 w-4" />
                  <span>Categoria</span>
                </div>
                <div className="text-lg font-medium">
                  {getCategoryName(product)}
                </div>
              </div>
            </div>

            {/* Descrição */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Descrição</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Estoque */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BarChart3 className="h-4 w-4" />
                  <span>Estoque Atual</span>
                </div>
                <div className="text-xl font-semibold">{product.stock_quantity || 0}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="h-4 w-4" />
                  <span>Estoque Mínimo</span>
                </div>
                <div className="text-xl font-semibold">{product.min_stock_quantity || 5}</div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="h-4 w-4" />
                  <span>Unidade</span>
                </div>
                <div className="text-lg font-medium">{product.unit || 'unidade'}</div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.sku && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash className="h-4 w-4" />
                    <span>SKU</span>
                  </div>
                  <div className="font-medium">{product.sku}</div>
                </div>
              )}
              
              {product.barcode && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Hash className="h-4 w-4" />
                    <span>Código de Barras</span>
                  </div>
                  <div className="font-medium">{product.barcode}</div>
                </div>
              )}
              
              {product.cost && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>Custo</span>
                  </div>
                  <div className="font-medium">{formatCurrency(product.cost)}</div>
                </div>
              )}
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Criado em</span>
                </div>
                <div className="font-medium">
                  {new Date(product.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductView;
