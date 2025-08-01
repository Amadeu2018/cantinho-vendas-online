import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Plus, Pencil, Trash2, Save } from "lucide-react";

interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  description?: string;
}

const DeliverySettings = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fee: "",
    description: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDeliveryZones();
  }, []);

  const fetchDeliveryZones = async () => {
    try {
      // Para agora, usar configuração padrão até criarmos a tabela delivery_zones
      setZones([
        { id: '1', name: 'Centro da Cidade', fee: 500, description: 'Entrega no centro' },
        { id: '2', name: 'Periferia', fee: 750, description: 'Entrega na periferia' },
        { id: '3', name: 'Fora da Cidade', fee: 1000, description: 'Entrega fora da cidade' }
      ]);
    } catch (error) {
      console.error('Erro ao buscar zonas de entrega:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as zonas de entrega",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.fee) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e taxa são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const zoneData = {
        name: formData.name,
        fee: parseFloat(formData.fee),
        description: formData.description
      };

      if (editingId) {
        // Update
        const updatedZones = zones.map(zone => 
          zone.id === editingId ? { ...zone, ...zoneData } : zone
        );
        setZones(updatedZones);
        setEditingId(null);
      } else {
        // Add new
        const newZone = {
          id: Date.now().toString(),
          ...zoneData
        };
        setZones([...zones, newZone]);
        setShowAddForm(false);
      }

      setFormData({ name: "", fee: "", description: "" });
      
      toast({
        title: "Sucesso",
        description: editingId ? "Zona atualizada com sucesso" : "Zona adicionada com sucesso"
      });
    } catch (error: any) {
      console.error('Erro ao salvar zona:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a zona de entrega",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (zone: DeliveryZone) => {
    setEditingId(zone.id);
    setFormData({
      name: zone.name,
      fee: zone.fee.toString(),
      description: zone.description || ""
    });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    try {
      setZones(zones.filter(zone => zone.id !== id));
      toast({
        title: "Sucesso",
        description: "Zona removida com sucesso"
      });
    } catch (error: any) {
      console.error('Erro ao remover zona:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a zona",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Configurações de Entrega
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Zone Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Zonas de Entrega</h3>
          <Button
            onClick={() => {
              setShowAddForm(true);
              setEditingId(null);
              setFormData({ name: "", fee: "", description: "" });
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Zona
          </Button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Zona *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Centro da Cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Taxa de Entrega (AOA) *</Label>
                  <Input
                    id="fee"
                    type="number"
                    step="0.01"
                    value={formData.fee}
                    onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                    placeholder="Ex: 500.00"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da zona de entrega"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingId ? "Atualizar" : "Adicionar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({ name: "", fee: "", description: "" });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Zones List */}
        <div className="space-y-3">
          {zones.map((zone) => (
            <Card key={zone.id} className="border-l-4 border-l-cantinho-terracotta">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg">{zone.name}</h4>
                    <p className="text-cantinho-terracotta font-semibold text-lg">
                      {formatCurrency(zone.fee)}
                    </p>
                    {zone.description && (
                      <p className="text-sm text-muted-foreground mt-1">{zone.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(zone)}
                      className="flex items-center gap-1"
                    >
                      <Pencil className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(zone.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {zones.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma zona de entrega configurada</p>
            <p className="text-sm">Clique em "Nova Zona" para adicionar uma</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliverySettings;