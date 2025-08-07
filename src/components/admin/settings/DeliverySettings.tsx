import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
  minOrderValue?: number;
}

const DeliverySettings = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([
    {
      id: "1",
      name: "Centro da Cidade",
      fee: 2.50,
      estimatedTime: "20-30 min",
      minOrderValue: 15.00
    },
    {
      id: "2", 
      name: "Zona Periférica",
      fee: 4.00,
      estimatedTime: "30-45 min",
      minOrderValue: 20.00
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    fee: "",
    estimatedTime: "",
    minOrderValue: ""
  });

  const { toast } = useToast();

  const handleSave = () => {
    if (!formData.name || !formData.fee || !formData.estimatedTime) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newZone: DeliveryZone = {
      id: editingZone?.id || String(Date.now()),
      name: formData.name,
      fee: parseFloat(formData.fee),
      estimatedTime: formData.estimatedTime,
      minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : undefined
    };

    if (editingZone) {
      setZones(zones.map(z => z.id === editingZone.id ? newZone : z));
      toast({
        title: "Zona atualizada",
        description: "Configurações de entrega atualizadas com sucesso!"
      });
    } else {
      setZones([...zones, newZone]);
      toast({
        title: "Zona adicionada", 
        description: "Nova zona de entrega criada com sucesso!"
      });
    }

    resetForm();
  };

  const handleEdit = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      fee: zone.fee.toString(),
      estimatedTime: zone.estimatedTime,
      minOrderValue: zone.minOrderValue?.toString() || ""
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
    toast({
      title: "Zona removida",
      description: "Zona de entrega removida com sucesso!"
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      fee: "",
      estimatedTime: "",
      minOrderValue: ""
    });
    setIsEditing(false);
    setEditingZone(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Configurações de Entrega</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Editar Zona" : "Nova Zona de Entrega"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Zona</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Centro da Cidade"
              />
            </div>

            <div>
              <Label htmlFor="fee">Taxa de Entrega (€)</Label>
              <Input
                id="fee"
                type="number"
                step="0.01"
                value={formData.fee}
                onChange={(e) => setFormData({...formData, fee: e.target.value})}
                placeholder="2.50"
              />
            </div>

            <div>
              <Label htmlFor="time">Tempo Estimado</Label>
              <Input
                id="time"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                placeholder="Ex: 20-30 min"
              />
            </div>

            <div>
              <Label htmlFor="minOrder">Valor Mínimo (€) - Opcional</Label>
              <Input
                id="minOrder"
                type="number"
                step="0.01"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                placeholder="15.00"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                {isEditing ? "Atualizar" : "Adicionar"}
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Zonas de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {zones.map((zone) => (
                <div key={zone.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{zone.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Taxa: €{zone.fee.toFixed(2)} • {zone.estimatedTime}
                      </p>
                      {zone.minOrderValue && (
                        <p className="text-xs text-muted-foreground">
                          Pedido mínimo: €{zone.minOrderValue.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(zone)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(zone.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliverySettings;