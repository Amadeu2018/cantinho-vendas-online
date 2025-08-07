import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, MapPin, Clock, Euro, Settings, Globe, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  estimatedTime: string;
  minOrderValue?: number;
  maxDistance?: number;
  isActive: boolean;
  freeDeliveryThreshold?: number;
  urgentFeeMultiplier?: number;
  coordinates?: { lat: number; lng: number }[];
}

interface DeliverySettings {
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  maxDeliveryDistance: number;
  defaultEstimatedTime: string;
  urgentDeliveryEnabled: boolean;
  urgentDeliveryFee: number;
  weekendFeeMultiplier: number;
  nightFeeMultiplier: number;
  currency: string;
  allowPartialDelivery: boolean;
  requireSignature: boolean;
}

const DeliverySettings = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([
    {
      id: "1",
      name: "Centro da Cidade",
      fee: 2.50,
      estimatedTime: "20-30 min",
      minOrderValue: 15.00,
      maxDistance: 5,
      isActive: true,
      freeDeliveryThreshold: 50.00,
      urgentFeeMultiplier: 1.5
    },
    {
      id: "2", 
      name: "Zona Periférica",
      fee: 4.00,
      estimatedTime: "30-45 min",
      minOrderValue: 20.00,
      maxDistance: 15,
      isActive: true,
      freeDeliveryThreshold: 60.00,
      urgentFeeMultiplier: 2.0
    },
    {
      id: "3",
      name: "Zona Rural",
      fee: 6.50,
      estimatedTime: "45-60 min",
      minOrderValue: 25.00,
      maxDistance: 30,
      isActive: false,
      freeDeliveryThreshold: 80.00,
      urgentFeeMultiplier: 2.5
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState<DeliverySettings>({
    baseDeliveryFee: 3.00,
    freeDeliveryThreshold: 50.00,
    maxDeliveryDistance: 25,
    defaultEstimatedTime: "30-45 min",
    urgentDeliveryEnabled: true,
    urgentDeliveryFee: 5.00,
    weekendFeeMultiplier: 1.2,
    nightFeeMultiplier: 1.3,
    currency: "EUR",
    allowPartialDelivery: true,
    requireSignature: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const [activeTab, setActiveTab] = useState("zones");
  const [formData, setFormData] = useState({
    name: "",
    fee: "",
    estimatedTime: "",
    minOrderValue: "",
    maxDistance: "",
    freeDeliveryThreshold: "",
    urgentFeeMultiplier: "",
    isActive: true
  });

  const { toast } = useToast();

  const handleSaveZone = () => {
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
      minOrderValue: formData.minOrderValue ? parseFloat(formData.minOrderValue) : undefined,
      maxDistance: formData.maxDistance ? parseFloat(formData.maxDistance) : undefined,
      freeDeliveryThreshold: formData.freeDeliveryThreshold ? parseFloat(formData.freeDeliveryThreshold) : undefined,
      urgentFeeMultiplier: formData.urgentFeeMultiplier ? parseFloat(formData.urgentFeeMultiplier) : 1.5,
      isActive: formData.isActive
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

  const handleEditZone = (zone: DeliveryZone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      fee: zone.fee.toString(),
      estimatedTime: zone.estimatedTime,
      minOrderValue: zone.minOrderValue?.toString() || "",
      maxDistance: zone.maxDistance?.toString() || "",
      freeDeliveryThreshold: zone.freeDeliveryThreshold?.toString() || "",
      urgentFeeMultiplier: zone.urgentFeeMultiplier?.toString() || "1.5",
      isActive: zone.isActive
    });
    setIsEditing(true);
  };

  const handleDeleteZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
    toast({
      title: "Zona removida",
      description: "Zona de entrega removida com sucesso!"
    });
  };

  const handleToggleZone = (id: string) => {
    setZones(zones.map(z => 
      z.id === id ? { ...z, isActive: !z.isActive } : z
    ));
    const zone = zones.find(z => z.id === id);
    toast({
      title: `Zona ${zone?.isActive ? "desativada" : "ativada"}`,
      description: `A zona "${zone?.name}" foi ${zone?.isActive ? "desativada" : "ativada"}.`
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      fee: "",
      estimatedTime: "",
      minOrderValue: "",
      maxDistance: "",
      freeDeliveryThreshold: "",
      urgentFeeMultiplier: "",
      isActive: true
    });
    setIsEditing(false);
    setEditingZone(null);
  };

  const handleSaveGlobalSettings = () => {
    // Here you would save to your backend/database
    toast({
      title: "Configurações salvas",
      description: "Configurações globais de entrega atualizadas!"
    });
  };

  const calculateEstimatedFee = (orderValue: number, zoneId: string, isUrgent: boolean = false, isWeekend: boolean = false, isNight: boolean = false) => {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return 0;

    let fee = zone.fee;

    // Free delivery threshold
    if (zone.freeDeliveryThreshold && orderValue >= zone.freeDeliveryThreshold) {
      fee = 0;
    }

    // Urgent delivery
    if (isUrgent && zone.urgentFeeMultiplier) {
      fee *= zone.urgentFeeMultiplier;
    }

    // Weekend multiplier
    if (isWeekend) {
      fee *= globalSettings.weekendFeeMultiplier;
    }

    // Night multiplier
    if (isNight) {
      fee *= globalSettings.nightFeeMultiplier;
    }

    return fee;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Configurações de Entrega
        </h2>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Zonas</p>
                <p className="text-2xl font-bold">{zones.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Zonas Ativas</p>
                <p className="text-2xl font-bold text-green-600">
                  {zones.filter(z => z.isActive).length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Média</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{(zones.reduce((acc, z) => acc + z.fee, 0) / zones.length).toFixed(2)}
                </p>
              </div>
              <Euro className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold text-orange-600">
                  35 min
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="zones">Zonas de Entrega</TabsTrigger>
          <TabsTrigger value="global">Configurações Globais</TabsTrigger>
          <TabsTrigger value="calculator">Calculadora</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? "Editar Zona" : "Nova Zona de Entrega"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Zona *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Centro da Cidade"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fee">Taxa de Entrega (€) *</Label>
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
                    <Label htmlFor="maxDistance">Distância Máx. (km)</Label>
                    <Input
                      id="maxDistance"
                      type="number"
                      step="0.1"
                      value={formData.maxDistance}
                      onChange={(e) => setFormData({...formData, maxDistance: e.target.value})}
                      placeholder="10.0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="time">Tempo Estimado *</Label>
                  <Input
                    id="time"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}
                    placeholder="Ex: 20-30 min"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minOrder">Pedido Mínimo (€)</Label>
                    <Input
                      id="minOrder"
                      type="number"
                      step="0.01"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                      placeholder="15.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="freeThreshold">Entrega Grátis a partir de (€)</Label>
                    <Input
                      id="freeThreshold"
                      type="number"
                      step="0.01"
                      value={formData.freeDeliveryThreshold}
                      onChange={(e) => setFormData({...formData, freeDeliveryThreshold: e.target.value})}
                      placeholder="50.00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="urgentMultiplier">Multiplicador Entrega Urgente</Label>
                  <Input
                    id="urgentMultiplier"
                    type="number"
                    step="0.1"
                    value={formData.urgentFeeMultiplier}
                    onChange={(e) => setFormData({...formData, urgentFeeMultiplier: e.target.value})}
                    placeholder="1.5"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="active">Zona ativa</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveZone} className="flex-1">
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
                  Zonas Configuradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {zones.map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{zone.name}</h4>
                            <Badge variant={zone.isActive ? "default" : "secondary"}>
                              {zone.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Taxa: €{zone.fee.toFixed(2)} • {zone.estimatedTime}</p>
                            {zone.minOrderValue && (
                              <p>Pedido mínimo: €{zone.minOrderValue.toFixed(2)}</p>
                            )}
                            {zone.freeDeliveryThreshold && (
                              <p>Entrega grátis: €{zone.freeDeliveryThreshold.toFixed(2)}+</p>
                            )}
                            {zone.maxDistance && (
                              <p>Distância máx: {zone.maxDistance}km</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleZone(zone.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditZone(zone)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteZone(zone.id)}
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
        </TabsContent>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações Básicas</h3>
                  
                  <div>
                    <Label htmlFor="baseDeliveryFee">Taxa Base de Entrega (€)</Label>
                    <Input
                      id="baseDeliveryFee"
                      type="number"
                      step="0.01"
                      value={globalSettings.baseDeliveryFee}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        baseDeliveryFee: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="freeDeliveryThreshold">Entrega Grátis a partir de (€)</Label>
                    <Input
                      id="freeDeliveryThreshold"
                      type="number"
                      step="0.01"
                      value={globalSettings.freeDeliveryThreshold}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        freeDeliveryThreshold: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxDeliveryDistance">Distância Máxima de Entrega (km)</Label>
                    <Input
                      id="maxDeliveryDistance"
                      type="number"
                      step="0.1"
                      value={globalSettings.maxDeliveryDistance}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        maxDeliveryDistance: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultEstimatedTime">Tempo Estimado Padrão</Label>
                    <Input
                      id="defaultEstimatedTime"
                      value={globalSettings.defaultEstimatedTime}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        defaultEstimatedTime: e.target.value
                      })}
                      placeholder="30-45 min"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Configurações Avançadas</h3>
                  
                  <div>
                    <Label htmlFor="urgentDeliveryFee">Taxa Entrega Urgente (€)</Label>
                    <Input
                      id="urgentDeliveryFee"
                      type="number"
                      step="0.01"
                      value={globalSettings.urgentDeliveryFee}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        urgentDeliveryFee: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="weekendMultiplier">Multiplicador Fim de Semana</Label>
                    <Input
                      id="weekendMultiplier"
                      type="number"
                      step="0.1"
                      value={globalSettings.weekendFeeMultiplier}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        weekendFeeMultiplier: parseFloat(e.target.value) || 1.0
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="nightMultiplier">Multiplicador Noturno</Label>
                    <Input
                      id="nightMultiplier"
                      type="number"
                      step="0.1"
                      value={globalSettings.nightFeeMultiplier}
                      onChange={(e) => setGlobalSettings({
                        ...globalSettings, 
                        nightFeeMultiplier: parseFloat(e.target.value) || 1.0
                      })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Moeda</Label>
                    <Select
                      value={globalSettings.currency}
                      onValueChange={(value) => setGlobalSettings({
                        ...globalSettings, 
                        currency: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                        <SelectItem value="AOA">Kwanza (Kz)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Opções de Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="urgentDeliveryEnabled"
                      checked={globalSettings.urgentDeliveryEnabled}
                      onCheckedChange={(checked) => setGlobalSettings({
                        ...globalSettings, 
                        urgentDeliveryEnabled: checked
                      })}
                    />
                    <Label htmlFor="urgentDeliveryEnabled">Entrega Urgente</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowPartialDelivery"
                      checked={globalSettings.allowPartialDelivery}
                      onCheckedChange={(checked) => setGlobalSettings({
                        ...globalSettings, 
                        allowPartialDelivery: checked
                      })}
                    />
                    <Label htmlFor="allowPartialDelivery">Entrega Parcial</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireSignature"
                      checked={globalSettings.requireSignature}
                      onCheckedChange={(checked) => setGlobalSettings({
                        ...globalSettings, 
                        requireSignature: checked
                      })}
                    />
                    <Label htmlFor="requireSignature">Assinatura Obrigatória</Label>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveGlobalSettings} className="w-full">
                Salvar Configurações Globais
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Calculadora de Taxa de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Parâmetros</h3>
                  
                  <div>
                    <Label htmlFor="orderValue">Valor do Pedido (€)</Label>
                    <Input
                      id="orderValue"
                      type="number"
                      step="0.01"
                      placeholder="25.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zone">Zona de Entrega</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.filter(z => z.isActive).map((zone) => (
                          <SelectItem key={zone.id} value={zone.id}>
                            {zone.name} - €{zone.fee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="isUrgent" />
                      <Label htmlFor="isUrgent">Entrega Urgente</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="isWeekend" />
                      <Label htmlFor="isWeekend">Fim de Semana</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="isNight" />
                      <Label htmlFor="isNight">Período Noturno</Label>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Resultado do Cálculo</h3>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Taxa Base:</span>
                      <span>€3.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiplicador Urgente (1.5x):</span>
                      <span>+€1.75</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Multiplicador Fim de Semana (1.2x):</span>
                      <span>+€0.60</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total da Entrega:</span>
                      <span>€5.85</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tempo estimado: 20-30 min
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 Dica</h4>
                    <p className="text-blue-800 text-sm">
                      Com um pedido de €50 ou mais, a entrega seria gratuita nesta zona!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeliverySettings;