import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Package, ArrowUpDown, Minus, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ProductsTableViewProps {
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

const ProductsTableView = ({
  products,
  sortField,
  sortDirection,
  onSort,
  onView,
  onEdit,
  onDelete,
  onUpdateStock,
  getCategoryName,
}: ProductsTableViewProps) => {
  if (!products?.length) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
        <p className="text-gray-400 text-sm mt-1">Adicione produtos para começar a vender</p>
      </div>
    );
  }

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 -ml-2"
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Imagem</TableHead>
            <TableHead>
              <SortButton field="name">Nome</SortButton>
            </TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">
              <SortButton field="price">Preço</SortButton>
            </TableHead>
            <TableHead className="text-center">
              <SortButton field="stock_quantity">Estoque</SortButton>
            </TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="h-12 w-12 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border">
                    <Package className="h-5 w-5" />
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  {product.description && (
                    <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">{getCategoryName(product)}</span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-semibold text-gray-900">{formatCurrency(product.price)}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => onUpdateStock(product, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className={`text-sm font-medium px-2 ${product.stock_quantity <= 0 ? "text-red-500" : "text-gray-900"}`}>
                    {product.stock_quantity || 0}
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0"
                    onClick={() => onUpdateStock(product, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-col gap-1">
                  {(product.stock_quantity || 0) <= 0 && (
                    <Badge variant="destructive" className="text-xs">
                      Sem Estoque
                    </Badge>
                  )}
                  {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock_quantity || 5) && (
                    <Badge variant="outline" className="border-amber-500 text-amber-600 text-xs">
                      Estoque Baixo
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onView(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTableView;