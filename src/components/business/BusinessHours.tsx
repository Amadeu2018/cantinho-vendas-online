import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Clock, Save, Edit, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DaySchedule {
  day: string;
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
  hasBreak: boolean;
}

const BusinessHours = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { day: 'monday', dayName: 'Segunda-feira', isOpen: true, openTime: '08:00', closeTime: '22:00', hasBreak: true, breakStart: '12:00', breakEnd: '14:00' },
    { day: 'tuesday', dayName: 'Terça-feira', isOpen: true, openTime: '08:00', closeTime: '22:00', hasBreak: true, breakStart: '12:00', breakEnd: '14:00' },
    { day: 'wednesday', dayName: 'Quarta-feira', isOpen: true, openTime: '08:00', closeTime: '22:00', hasBreak: true, breakStart: '12:00', breakEnd: '14:00' },
    { day: 'thursday', dayName: 'Quinta-feira', isOpen: true, openTime: '08:00', closeTime: '22:00', hasBreak: true, breakStart: '12:00', breakEnd: '14:00' },
    { day: 'friday', dayName: 'Sexta-feira', isOpen: true, openTime: '08:00', closeTime: '23:00', hasBreak: true, breakStart: '12:00', breakEnd: '14:00' },
    { day: 'saturday', dayName: 'Sábado', isOpen: true, openTime: '09:00', closeTime: '23:00', hasBreak: false },
    { day: 'sunday', dayName: 'Domingo', isOpen: true, openTime: '10:00', closeTime: '20:00', hasBreak: false }
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [specialHours, setSpecialHours] = useState<string>('');
  const { toast } = useToast();

  const getCurrentStatus = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);
    
    // Convert Sunday (0) to our array index (6)
    const dayIndex = currentDay === 0 ? 6 : currentDay - 1;
    const today = schedule[dayIndex];
    
    if (!today.isOpen) {
      return { isOpen: false, message: 'Fechado hoje' };
    }
    
    // Check if we're in break time
    if (today.hasBreak && today.breakStart && today.breakEnd) {
      if (currentTime >= today.breakStart && currentTime < today.breakEnd) {
        return { isOpen: false, message: `Intervalo até ${today.breakEnd}` };
      }
    }
    
    // Check if we're within opening hours
    if (currentTime >= today.openTime && currentTime < today.closeTime) {
      return { isOpen: true, message: `Aberto até ${today.closeTime}` };
    }
    
    return { isOpen: false, message: 'Fechado' };
  };

  const updateSchedule = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    setSchedule(prev => prev.map((day, index) =>
      index === dayIndex ? { ...day, [field]: value } : day
    ));
  };

  const saveSchedule = () => {
    // Here you would typically save to your backend
    toast({
      title: "Horários salvos",
      description: "Os horários de funcionamento foram atualizados com sucesso"
    });
    setIsEditing(false);
  };

  const copyToAllDays = (sourceIndex: number) => {
    const sourceDay = schedule[sourceIndex];
    setSchedule(prev => prev.map(day => ({
      ...day,
      isOpen: sourceDay.isOpen,
      openTime: sourceDay.openTime,
      closeTime: sourceDay.closeTime,
      hasBreak: sourceDay.hasBreak,
      breakStart: sourceDay.breakStart,
      breakEnd: sourceDay.breakEnd
    })));
    
    toast({
      title: "Horários copiados",
      description: `Horários de ${sourceDay.dayName} aplicados a todos os dias`
    });
  };

  const status = getCurrentStatus();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Status Atual</span>
            </CardTitle>
            <Badge 
              variant={status.isOpen ? "default" : "secondary"}
              className={status.isOpen ? "bg-green-500" : "bg-red-500"}
            >
              {status.isOpen ? "Aberto" : "Fechado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <AlertCircle className={`h-4 w-4 ${status.isOpen ? 'text-green-600' : 'text-red-600'}`} />
            <span className="font-medium">{status.message}</span>
          </div>
          
          {specialHours && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Aviso especial:</strong> {specialHours}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Horários de Funcionamento</CardTitle>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {schedule.map((day, index) => (
            <div key={day.day} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{day.dayName}</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={day.isOpen}
                    onCheckedChange={(checked) => updateSchedule(index, 'isOpen', checked)}
                    disabled={!isEditing}
                  />
                  <span className="text-sm text-gray-500">
                    {day.isOpen ? 'Aberto' : 'Fechado'}
                  </span>
                </div>
              </div>
              
              {day.isOpen && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs">Abertura</Label>
                    <Input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => updateSchedule(index, 'openTime', e.target.value)}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Fechamento</Label>
                    <Input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => updateSchedule(index, 'closeTime', e.target.value)}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                  
                  {day.hasBreak && (
                    <>
                      <div>
                        <Label className="text-xs">Início Intervalo</Label>
                        <Input
                          type="time"
                          value={day.breakStart || ''}
                          onChange={(e) => updateSchedule(index, 'breakStart', e.target.value)}
                          disabled={!isEditing}
                          className="text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Fim Intervalo</Label>
                        <Input
                          type="time"
                          value={day.breakEnd || ''}
                          onChange={(e) => updateSchedule(index, 'breakEnd', e.target.value)}
                          disabled={!isEditing}
                          className="text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {isEditing && day.isOpen && (
                <div className="mt-3 flex items-center space-x-3">
                  <Switch
                    checked={day.hasBreak}
                    onCheckedChange={(checked) => updateSchedule(index, 'hasBreak', checked)}
                  />
                  <span className="text-sm text-gray-500">Tem intervalo</span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToAllDays(index)}
                    className="ml-auto"
                  >
                    Copiar para todos
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="space-y-3">
              <Label>Aviso especial (opcional)</Label>
              <Input
                value={specialHours}
                onChange={(e) => setSpecialHours(e.target.value)}
                placeholder="Ex: Fechado para manutenção no dia 25/12"
              />
              
              <Button onClick={saveSchedule} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Horários
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessHours;