
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
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  // Renderização de cards para dispositivos móveis
  if (isMobile) {
    return (
      <div className="space-y-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="mobile-card-view">
              <div className="flex items-center gap-3 mb-3">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="h-16 w-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                    <Eye className="h-6 w-6" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">{getCategoryName(product)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <div className="mobile-card-label">Preço</div>
                  <div className="mobile-card-value">{formatCurrency(product.price)}</div>
                </div>
                <div>
                  <div className="mobile-card-label">Estoque</div>
                  <div className="flex items-center">
                    <span className={`mobile-card-value ${product.stock_quantity <= 0 ? "text-red-500" : ""}`}>
                      {product.stock_quantity || 0} {product.unit || "unidade"}
                    </span>
                    {(product.stock_quantity || 0) <= 0 && (
                      <Badge variant="destructive" className="ml-2 text-xs">Sem Estoque</Badge>
                    )}
                    {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                      <Badge variant="outline" className="ml-2 border-amber-500 text-amber-600 text-xs">Baixo</Badge>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-1">
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0"
                      onClick={() => onUpdateStock(product, -1)}>
                      -
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 w-7 p-0"
                      onClick={() => onUpdateStock(product, 1)}>
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 border-t pt-3">
                <Button variant="ghost" size="sm" onClick={() => onView(product)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p>Nenhum produto encontrado</p>
          </div>
        )}
      </div>
    );
  }

  // Renderização de tabela para desktop
  return (
    <div className="admin-table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center">
                Nome
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("price")}
            >
              <div className="flex items-center">
                Preço
                <SortIcon field="price" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onSort("stock_quantity")}
            >
              <div className="flex items-center">
                Estoque
                <SortIcon field="stock_quantity" />
              </div>
            </TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length > 0 ? (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="h-12 w-12 object-cover rounded-md"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      <Eye className="h-6 w-6" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <span className={product.stock_quantity <= 0 ? "text-red-500" : ""}>
                        {product.stock_quantity || 0}
                      </span>
                      <span className="ml-1">{product.unit || "unidade"}</span>
                      {(product.stock_quantity || 0) <= 0 && (
                        <Badge variant="destructive" className="ml-2">Sem Estoque</Badge>
                      )}
                      {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                        <Badge variant="outline" className="ml-2 border-amber-500 text-amber-600">Estoque Baixo</Badge>
                      )}
                    </div>
                    
                    <div className="flex space-x-1 ml-2">
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0"
                        onClick={() => onUpdateStock(product, -1)}>
                        -
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0"
                        onClick={() => onUpdateStock(product, 1)}>
                        +
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getCategoryName(product)}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onView(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <p>Nenhum produto encontrado</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsList;
