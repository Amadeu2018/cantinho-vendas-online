import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Truck, MapPin, Plus, Edit2, Trash2 } from "lucide-react";

interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimated_time: string;
  is_active: boolean;
}

const DeliveryFeeManager = () => {
  const { toast } = useToast();
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fee: 0,
    estimated_time: "",
    is_active: true
  });

  useEffect(() => {
    fetchDeliveryZones();
  }, []);

  const fetchDeliveryZones = async () => {
    try {
      setLoading(true);
      
      // Since we don't have a delivery_zones table, we'll use the existing company_settings
      // and create a mock implementation for demonstration
      const mockZones: DeliveryZone[] = [
        { id: "1", name: "Bairro Azul", fee: 1000, estimated_time: "20-30 min", is_active: true },
        { id: "2", name: "Maculusso", fee: 1500, estimated_time: "25-35 min", is_active: true },
        { id: "3", name: "Maianga", fee: 1500, estimated_time: "25-35 min", is_active: true },
        { id: "4", name: "Talatona", fee: 2500, estimated_time: "35-50 min", is_active: true },
        { id: "5", name: "Miramar", fee: 1800, estimated_time: "30-40 min", is_active: true },
        { id: "6", name: "Kilamba", fee: 3000, estimated_time: "40-60 min", is_active: true },
      ];
      
      setZones(mockZones);
    } catch (error) {
      console.error('Error fetching delivery zones:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar zonas de entrega",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name || formData.fee <= 0) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos obrigatórios",
          variant: "destructive",
        });
        return;
      }

      if (editingZone) {
        // Update existing zone
        const updatedZones = zones.map(zone =>
          zone.id === editingZone.id
            ? { ...zone, ...formData }
            : zone
        );
        setZones(updatedZones);
        
        toast({
          title: "Sucesso",
          description: "Zona de entrega atualizada com sucesso",
        });
      } else {
        // Add new zone
        const newZone: DeliveryZone = {
          id: Date.now().toString(),
          ...formData
        };
        setZones([...zones, newZone]);
        
        toast({
          title: "Sucesso",
          description: "Nova zona de entrega criada com sucesso",
        });
      }

      resetForm();
    } catch (error) {
      console.error('Error saving delivery zone:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar zona de entrega",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      fee: zone.fee,
      estimated_time: zone.estimated_time,
      is_active: zone.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedZones = zones.filter(zone => zone.id !== id);
      setZones(updatedZones);
      
      toast({
        title: "Sucesso",
        description: "Zona de entrega removida com sucesso",
      });
    } catch (error) {
      console.error('Error deleting delivery zone:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover zona de entrega",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      fee: 0,
      estimated_time: "",
      is_active: true
    });
    setEditingZone(null);
    setShowForm(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-AO', { 
      style: 'currency', 
      currency: 'AOA' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-cantinho-terracotta border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cantinho-terracotta/10 rounded-lg">
                <Truck className="h-5 w-5 text-cantinho-terracotta" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-cantinho-navy">
                  Gestão de Taxas de Entrega
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Configure zonas de entrega e suas respectivas taxas
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Zona
            </Button>
          </div>
        </CardHeader>

        {showForm && (
          <CardContent className="border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Zona *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Bairro Central"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Taxa de Entrega (AOA) *</Label>
                <Input
                  id="fee"
                  type="number"
                  value={formData.fee}
                  onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
                  placeholder="1500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_time">Tempo Estimado</Label>
                <Input
                  id="estimated_time"
                  value={formData.estimated_time}
                  onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value })}
                  placeholder="Ex: 20-30 min"
                />
              </div>

              <div className="flex items-center justify-end gap-2 md:col-span-1">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
                >
                  {editingZone ? 'Atualizar' : 'Criar'} Zona
                </Button>
              </div>
            </div>
          </CardContent>
        )}

        <CardContent>
          <div className="space-y-4">
            {zones.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma zona configurada
                </h3>
                <p className="text-gray-600 mb-4">
                  Adicione zonas de entrega para configurar taxas personalizadas.
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Zona
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-cantinho-terracotta/10 rounded-lg">
                        <MapPin className="h-4 w-4 text-cantinho-terracotta" />
                      </div>
                      <div>
                        <h4 className="font-medium text-cantinho-navy">{zone.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Taxa: {formatCurrency(zone.fee)}</span>
                          <span>Tempo: {zone.estimated_time}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            zone.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {zone.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(zone)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(zone.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryFeeManager;