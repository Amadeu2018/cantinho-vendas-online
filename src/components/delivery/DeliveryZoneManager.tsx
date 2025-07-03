import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MapPin, Plus, Edit, Trash2, Clock, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryZone {
  id: number;
  name: string;
  fee: number;
  estimatedTime: string;
  isActive: boolean;
  description?: string;
  maxDistance?: number;
}

const DeliveryZoneManager = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([
    { id: 1, name: "Bairro Azul", fee: 1000, estimatedTime: "20-30 min", isActive: true, maxDistance: 5 },
    { id: 2, name: "Maculusso", fee: 1500, estimatedTime: "25-35 min", isActive: true, maxDistance: 8 },
    { id: 3, name: "Maianga", fee: 1500, estimatedTime: "25-35 min", isActive: true, maxDistance: 7 },
    { id: 4, name: "Talatona", fee: 2500, estimatedTime: "35-50 min", isActive: true, maxDistance: 15 },
    { id: 5, name: "Miramar", fee: 1800, estimatedTime: "30-40 min", isActive: true, maxDistance: 10 },
    { id: 6, name: "Kilamba", fee: 3000, estimatedTime: "40-60 min", isActive: false, maxDistance: 20 }
  ]);
  
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<DeliveryZone>>({});
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.fee || !formData.estimatedTime) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (editingZone) {
      // Update existing zone
      setZones(prev => prev.map(zone => 
        zone.id === editingZone.id 
          ? { ...zone, ...formData } as DeliveryZone
          : zone
      ));
      toast({
        title: "Zona atualizada",
        description: `Zona ${formData.name} foi atualizada com sucesso`
      });
    } else {
      // Add new zone
      const newZone: DeliveryZone = {
        id: Math.max(...zones.map(z => z.id)) + 1,
        name: formData.name!,
        fee: formData.fee!,
        estimatedTime: formData.estimatedTime!,
        isActive: formData.isActive ?? true,
        description: formData.description,
        maxDistance: formData.maxDistance
      };
      
      setZones(prev => [...prev, newZone]);
      toast({
        title: "Zona adicionada",
        description: `Zona ${formData.name} foi criada com sucesso`
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({});
    setEditingZone(null);
    setIsAddingNew(false);
  };

  const startEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setFormData(zone);
    setIsAddingNew(false);
  };

  const startAdd = () => {
    setFormData({ isActive: true });
    setIsAddingNew(true);
    setEditingZone(null);
  };

  const toggleZoneStatus = (zoneId: number) => {
    setZones(prev => prev.map(zone =>
      zone.id === zoneId 
        ? { ...zone, isActive: !zone.isActive }
        : zone
    ));
    
    const zone = zones.find(z => z.id === zoneId);
    toast({
      title: "Status atualizado",
      description: `Zona ${zone?.name} foi ${zone?.isActive ? 'desativada' : 'ativada'}`
    });
  };

  const deleteZone = (zoneId: number) => {
    const zone = zones.find(z => z.id === zoneId);
    setZones(prev => prev.filter(zone => zone.id !== zoneId));
    toast({
      title: "Zona removida",
      description: `Zona ${zone?.name} foi removida`
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Zonas de Entrega</h2>
        <Button onClick={startAdd} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Zona</span>
        </Button>
      </div>

      {/* Form for adding/editing */}
      {(isAddingNew || editingZone) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingZone ? 'Editar Zona' : 'Nova Zona de Entrega'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome da Zona *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Bairro Central"
                  />
                </div>
                
                <div>
                  <Label htmlFor="fee">Taxa de Entrega (AOA) *</Label>
                  <Input
                    id="fee"
                    type="number"
                    value={formData.fee || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, fee: Number(e.target.value) }))}
                    placeholder="1500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estimatedTime">Tempo Estimado *</Label>
                  <Input
                    id="estimatedTime"
                    value={formData.estimatedTime || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                    placeholder="25-35 min"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxDistance">Distância Máxima (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    value={formData.maxDistance || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxDistance: Number(e.target.value) }))}
                    placeholder="10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Zona central da cidade com fácil acesso"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive ?? true}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Zona ativa</Label>
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit">
                  {editingZone ? 'Atualizar' : 'Criar'} Zona
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Zones List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {zones.map(zone => (
          <Card key={zone.id} className={!zone.isActive ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cantinho-navy/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-cantinho-navy" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                    {zone.description && (
                      <p className="text-sm text-gray-500">{zone.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Badge variant={zone.isActive ? "default" : "secondary"}>
                    {zone.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">
                    {formatPrice(zone.fee)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{zone.estimatedTime}</span>
                </div>
              </div>
              
              {zone.maxDistance && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    Até {zone.maxDistance}km de distância
                  </span>
                </div>
              )}
              
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(zone)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Editar</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleZoneStatus(zone.id)}
                  className="flex items-center space-x-1"
                >
                  <span>{zone.isActive ? 'Desativar' : 'Ativar'}</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteZone(zone.id)}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeliveryZoneManager;