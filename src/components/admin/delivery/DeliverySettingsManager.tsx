import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, MapPin, Calculator, Clock } from "lucide-react";

interface DeliverySettings {
  id?: string;
  base_fee: number;
  per_km_rate: number;
  free_delivery_threshold: number;
  max_delivery_distance: number;
  estimated_delivery_time: number;
  active_zones: string[];
}

const DeliverySettingsManager = () => {
  const [settings, setSettings] = useState<DeliverySettings>({
    base_fee: 0,
    per_km_rate: 0,
    free_delivery_threshold: 0,
    max_delivery_distance: 0,
    estimated_delivery_time: 30,
    active_zones: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          id: data.id,
          base_fee: 500, // AOA
          per_km_rate: 100,
          free_delivery_threshold: 5000,
          max_delivery_distance: 25,
          estimated_delivery_time: 45,
          active_zones: ['Luanda', 'Talatona', 'Viana']
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações de entrega",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          id: settings.id || '00000000-0000-0000-0000-000000000001',
          // Add delivery-specific fields as needed
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configurações de entrega atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configuração de Taxa de Entrega</h2>
          <p className="text-muted-foreground">Gerencie as taxas e configurações de entrega</p>
        </div>
        <Button onClick={saveSettings} disabled={saving} className="min-w-32">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Taxas de Entrega
            </CardTitle>
            <CardDescription>Configure as taxas básicas de entrega</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="base_fee">Taxa Base (AOA)</Label>
              <Input
                id="base_fee"
                type="number"
                value={settings.base_fee}
                onChange={(e) => setSettings(prev => ({ ...prev, base_fee: Number(e.target.value) }))}
                placeholder="Ex: 500"
              />
            </div>
            <div>
              <Label htmlFor="per_km_rate">Taxa por KM (AOA)</Label>
              <Input
                id="per_km_rate"
                type="number"
                value={settings.per_km_rate}
                onChange={(e) => setSettings(prev => ({ ...prev, per_km_rate: Number(e.target.value) }))}
                placeholder="Ex: 100"
              />
            </div>
            <div>
              <Label htmlFor="free_threshold">Entrega Grátis a partir de (AOA)</Label>
              <Input
                id="free_threshold"
                type="number"
                value={settings.free_delivery_threshold}
                onChange={(e) => setSettings(prev => ({ ...prev, free_delivery_threshold: Number(e.target.value) }))}
                placeholder="Ex: 5000"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Área de Entrega
            </CardTitle>
            <CardDescription>Configure os limites de entrega</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="max_distance">Distância Máxima (KM)</Label>
              <Input
                id="max_distance"
                type="number"
                value={settings.max_delivery_distance}
                onChange={(e) => setSettings(prev => ({ ...prev, max_delivery_distance: Number(e.target.value) }))}
                placeholder="Ex: 25"
              />
            </div>
            <div>
              <Label htmlFor="delivery_time">Tempo Estimado (minutos)</Label>
              <Input
                id="delivery_time"
                type="number"
                value={settings.estimated_delivery_time}
                onChange={(e) => setSettings(prev => ({ ...prev, estimated_delivery_time: Number(e.target.value) }))}
                placeholder="Ex: 45"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Zonas Ativas
          </CardTitle>
          <CardDescription>Áreas onde oferecemos serviço de entrega</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {settings.active_zones.map((zone, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <span className="font-medium">{zone}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliverySettingsManager;