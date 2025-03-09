
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Mock inventory data
const initialInventory = [
  { id: 1, name: "Bacalhau", category: "Peixe", stock: 25, unit: "kg", price: 4500, alert: 10 },
  { id: 2, name: "Azeite", category: "Óleo", stock: 40, unit: "L", price: 2000, alert: 15 },
  { id: 3, name: "Batata", category: "Legumes", stock: 50, unit: "kg", price: 800, alert: 20 },
  { id: 4, name: "Chouriço", category: "Charcutaria", stock: 15, unit: "kg", price: 3000, alert: 5 },
  { id: 5, name: "Vinho Tinto", category: "Bebidas", stock: 30, unit: "garrafa", price: 2500, alert: 10 },
  { id: 6, name: "Azeitonas", category: "Conservas", stock: 45, unit: "kg", price: 1500, alert: 15 },
  { id: 7, name: "Pão", category: "Padaria", stock: 8, unit: "unidade", price: 200, alert: 10 },
  { id: 8, name: "Queijo", category: "Laticínios", stock: 12, unit: "kg", price: 3500, alert: 5 }
];

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  alert: number;
};

const AdminInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id"> | null>(null);
  
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm({...item});
  };
  
  const handleSave = () => {
    if (editForm) {
      setInventory(inventory.map(item => 
        item.id === editForm.id ? editForm : item
      ));
      setEditingId(null);
      setEditForm(null);
    }
  };
  
  const handleDelete = (id: number) => {
    setInventory(inventory.filter(item => item.id !== id));
  };
  
  const handleAddNew = () => {
    setNewItem({
      name: "",
      category: "",
      stock: 0,
      unit: "",
      price: 0,
      alert: 0
    });
  };
  
  const handleSaveNew = () => {
    if (newItem) {
      const newId = Math.max(0, ...inventory.map(item => item.id)) + 1;
      setInventory([...inventory, { ...newItem, id: newId }]);
      setNewItem(null);
    }
  };
  
  const handleCancelNew = () => {
    setNewItem(null);
  };
  
  const handleStockChange = (id: number, change: number) => {
    setInventory(inventory.map(item => 
      item.id === id ? { ...item, stock: Math.max(0, item.stock + change) } : item
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar item..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Item
        </Button>
      </div>
      
      {newItem && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Novo Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <Input
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Unidade</label>
                <Input
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Estoque</label>
                <Input
                  type="number"
                  value={newItem.stock}
                  onChange={(e) => setNewItem({...newItem, stock: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preço</label>
                <Input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Alerta Estoque Baixo</label>
                <Input
                  type="number"
                  value={newItem.alert}
                  onChange={(e) => setNewItem({...newItem, alert: parseInt(e.target.value) || 0})}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancelNew}>Cancelar</Button>
              <Button onClick={handleSaveNew}>Salvar</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Inventário</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  {editingId === item.id ? (
                    <>
                      <TableCell>
                        <Input
                          value={editForm?.name}
                          onChange={(e) => setEditForm({...editForm!, name: e.target.value})}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editForm?.category}
                          onChange={(e) => setEditForm({...editForm!, category: e.target.value})}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editForm?.stock}
                            onChange={(e) => setEditForm({...editForm!, stock: parseInt(e.target.value) || 0})}
                            className="w-20"
                          />
                          <span>{editForm?.unit}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={editForm?.price}
                          onChange={(e) => setEditForm({...editForm!, price: parseInt(e.target.value) || 0})}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={handleSave} className="mr-2">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`${item.stock <= item.alert ? "text-red-500 font-bold" : ""}`}>
                            {item.stock}
                          </span>
                          <span>{item.unit}</span>
                          {item.stock <= item.alert && (
                            <Badge variant="destructive" className="ml-2">Baixo</Badge>
                          )}
                          <div className="flex gap-1 ml-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 w-6 p-0"
                              onClick={() => handleStockChange(item.id, -1)}
                            >
                              -
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-6 w-6 p-0"
                              onClick={() => handleStockChange(item.id, 1)}
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
                          onClick={() => handleEdit(item)}
                          className="mr-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {filteredInventory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum item encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory
              .filter(item => item.stock <= item.alert)
              .map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-md">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold">{item.stock} {item.unit}</p>
                    <p className="text-sm text-gray-500">Alerta: {item.alert}</p>
                  </div>
                </div>
              ))}
            
            {inventory.filter(item => item.stock <= item.alert).length === 0 && (
              <p className="text-center py-4 text-green-600">
                Nenhum item com estoque baixo
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInventory;
