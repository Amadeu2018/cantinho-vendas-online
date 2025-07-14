import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
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
  getCategoryName
}: ProductsTableViewProps) => {
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 md:h-4 md:w-4 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 md:h-4 md:w-4 ml-1" />
    );
  };

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

export default ProductsTableView;