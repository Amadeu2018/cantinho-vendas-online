
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductsListProps {
  products: any[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  onView: (product: any) => void;
  onEdit: (product: any) => void;
  onDelete: (id: string) => void;
  onUpdateStock: (product: any, change: number) => void;
  getCategoryName: (product: any) => string;
}

const ProductsList = ({
  products,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
  getCategoryName
}: ProductsListProps) => {
  const isMobile = useIsMobile();

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 md:h-4 md:w-4 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 md:h-4 md:w-4 ml-1" />
    );
  };

  // Renderização de cards para dispositivos móveis
  if (isMobile) {
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
  }

  // Renderização de tabela para desktop
  return (
    <div className="admin-table-container overflow-x-auto w-full">
      <div className="min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Imagem</TableHead>
              <TableHead 
                className="cursor-pointer px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  Nome
                  <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => onSort("price")}
              >
                <div className="flex items-center">
                  Preço
                  <SortIcon field="price" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => onSort("stock_quantity")}
              >
                <div className="flex items-center">
                  Estoque
                  <SortIcon field="stock_quantity" />
                </div>
              </TableHead>
              <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Categoria</TableHead>
              <TableHead className="px-3 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="px-3 py-4">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                        <Eye className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="max-w-[200px]">
                      <p className="font-medium text-gray-900 text-sm truncate">{product.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-4 whitespace-nowrap">
                    <span className="font-semibold text-gray-900 text-sm">{formatCurrency(product.price)}</span>
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className={`text-sm ${product.stock_quantity <= 0 ? "text-red-500 font-medium" : "text-gray-900"}`}>
                            {product.stock_quantity || 0}
                          </span>
                          <span className="text-xs text-gray-500">{product.unit || "unidade"}</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {(product.stock_quantity || 0) <= 0 && (
                            <Badge variant="destructive" className="text-xs px-1 py-0">Sem Estoque</Badge>
                          )}
                          {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                            <Badge variant="outline" className="text-xs px-1 py-0 border-amber-500 text-amber-600">Estoque Baixo</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1 ml-2">
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
                  </TableCell>
                  <TableCell className="px-3 py-4">
                    <span className="text-sm text-gray-900">{getCategoryName(product)}</span>
                  </TableCell>
                  <TableCell className="px-3 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => onView(product)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 md:py-12">
                  <p className="text-sm md:text-base text-gray-500">Nenhum produto encontrado</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsList;
