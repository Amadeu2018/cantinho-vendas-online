
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Save, Plus, Minus, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (inventory.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium">Nenhum produto encontrado</h3>
        <p className="text-muted-foreground">Ajuste os filtros ou adicione novos produtos</p>
      </div>
    );
  }

  // Mobile View - Cards
  if (isMobile) {
    return (
      <div className="space-y-3 p-3">
        {inventory.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              {editingId === item.id ? (
                // Edit Mode Mobile
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category_name}</p>
                    </div>
                    {item.stock_quantity <= item.min_stock_quantity && (
                      <Badge variant="destructive" className="ml-2">Baixo</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Estoque</label>
                      <Input
                        type="number"
                        value={editForm?.stock_quantity}
                        onChange={(e) => onEditFormChange({...editForm!, stock_quantity: parseInt(e.target.value) || 0})}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Alerta Min.</label>
                      <Input
                        type="number"
                        value={editForm?.min_stock_quantity}
                        onChange={(e) => onEditFormChange({...editForm!, min_stock_quantity: parseInt(e.target.value) || 0})}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Preço</label>
                    <Input
                      type="number"
                      value={editForm?.price}
                      onChange={(e) => onEditFormChange({...editForm!, price: parseFloat(e.target.value) || 0})}
                      step="0.01"
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" onClick={onSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={onCancelEdit} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode Mobile
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category_name}</p>
                      <p className="text-lg font-bold text-cantinho-navy mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-lg font-bold ${item.stock_quantity <= item.min_stock_quantity ? "text-red-500" : "text-green-600"}`}>
                          {item.stock_quantity}
                        </span>
                        <span className="text-sm text-muted-foreground">{item.unit}</span>
                        {item.stock_quantity <= item.min_stock_quantity && (
                          <Badge variant="destructive">Baixo</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stock Quick Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => onStockChange(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => onStockChange(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant="ghost" 
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop/Tablet View - Table
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              {editingId === item.id ? (
                <>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editForm?.stock_quantity}
                        onChange={(e) => onEditFormChange({...editForm!, stock_quantity: parseInt(e.target.value) || 0})}
                        className="w-20"
                      />
                      <span className="text-sm">{item.unit}</span>
                      <Input
                        type="number"
                        value={editForm?.min_stock_quantity}
                        onChange={(e) => onEditFormChange({...editForm!, min_stock_quantity: parseInt(e.target.value) || 0})}
                        className="w-20 ml-2"
                        placeholder="Min."
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={onSave}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={onCancelEdit}>
                        Cancelar
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${item.stock_quantity <= item.min_stock_quantity ? "text-red-500" : ""}`}>
                        {item.stock_quantity}
                      </span>
                      <span className="text-sm text-muted-foreground">{item.unit}</span>
                      {item.stock_quantity <= item.min_stock_quantity && (
                        <Badge variant="destructive">Baixo</Badge>
                      )}
                      <div className="flex gap-1 ml-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 w-6 p-0"
                          onClick={() => onStockChange(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-6 w-6 p-0"
                          onClick={() => onStockChange(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        size="sm"
                        variant="ghost" 
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryList;
