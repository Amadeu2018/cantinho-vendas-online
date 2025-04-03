
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InventoryListProps {
  inventory: any[];
  editingId: string | null;
  editForm: any | null;
  onEdit: (item: any) => void;
  onEditFormChange: (form: any) => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onStockChange: (id: string, change: number) => void;
}

const InventoryList = ({
  inventory,
  editingId,
  editForm,
  onEdit,
  onEditFormChange,
  onSave,
  onCancelEdit,
  onDelete,
  onStockChange
}: InventoryListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Estoque</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.length > 0 ? (
          inventory.map((item) => (
            <TableRow key={item.id}>
              {editingId === item.id ? (
                <>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editForm?.stock_quantity}
                        onChange={(e) => onEditFormChange({...editForm!, stock_quantity: parseInt(e.target.value) || 0})}
                        className="w-20"
                      />
                      <span>{item.unit}</span>
                      <Input
                        type="number"
                        value={editForm?.min_stock_quantity}
                        onChange={(e) => onEditFormChange({...editForm!, min_stock_quantity: parseInt(e.target.value) || 0})}
                        className="w-20 ml-2"
                        placeholder="Alerta min."
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editForm?.price}
                      onChange={(e) => onEditFormChange({...editForm!, price: parseFloat(e.target.value) || 0})}
                      className="w-24"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="sm" onClick={onSave} className="mr-2">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={onCancelEdit}>
                      Cancelar
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`${item.stock_quantity <= item.min_stock_quantity ? "text-red-500 font-bold" : ""}`}>
                        {item.stock_quantity}
                      </span>
                      <span>{item.unit}</span>
                      {item.stock_quantity <= item.min_stock_quantity && (
                        <Badge variant="destructive" className="ml-2">Baixo</Badge>
                      )}
                      <div className="flex gap-1 ml-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 w-6 p-0"
                          onClick={() => onStockChange(item.id, -1)}
                        >
                          -
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 w-6 p-0"
                          onClick={() => onStockChange(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.price)}</TableCell>
                  <TableCell>
                    <Button 
                      size="sm"
                      variant="ghost" 
                      onClick={() => onEdit(item)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onDelete(item.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              Nenhum item encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default InventoryList;
