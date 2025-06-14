
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, MapPin, Clock, Phone, Mail, User, Gift } from "lucide-react";
import { useFirstOrder } from "@/hooks/use-first-order";
import { useToast } from "@/hooks/use-toast";

export interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
}

export interface EventFormData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  guestCount: number;
  specialRequests: string;
  budget: number;
}

const EventForm = ({ onSubmit }: EventFormProps) => {
  const { isFirstOrder, discount } = useFirstOrder();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EventFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    guestCount: 0,
    specialRequests: "",
    budget: 0,
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<EventFormData> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Nome é obrigatório";
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Email inválido";
    }

    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = "Telefone é obrigatório";
    }

    if (!formData.eventType.trim()) {
      newErrors.eventType = "Tipo de evento é obrigatório";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Data é obrigatória";
    }

    if (!formData.eventTime) {
      newErrors.eventTime = "Hora é obrigatória";
    }

    if (!formData.eventLocation.trim()) {
      newErrors.eventLocation = "Local é obrigatório";
    }

    if (formData.guestCount <= 0) {
      newErrors.guestCount = "Número de convidados deve ser maior que 0";
    }

    if (formData.budget <= 0) {
      newErrors.budget = "Orçamento deve ser maior que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const finalBudget = isFirstOrder ? formData.budget * (1 - discount) : formData.budget;
      
      if (isFirstOrder) {
        toast({
          title: "Primeiro evento!",
          description: `Você economizou ${(formData.budget - finalBudget).toLocaleString('pt-AO', { 
            style: 'currency', 
            currency: 'AOA' 
          })} no seu primeiro evento! 🎉`,
        });
      }
      
      onSubmit({
        ...formData,
        budget: finalBudget
      });
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-cantinho-terracotta" />
          Solicitar Orçamento para Evento
        </CardTitle>
        {isFirstOrder && (
          <Badge className="bg-green-500 text-white w-fit">
            <Gift className="h-3 w-3 mr-1" />
            10% de desconto no primeiro evento!
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações do Cliente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nome Completo *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  className={errors.clientName ? 'border-red-500' : ''}
                />
                {errors.clientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="clientPhone">Telefone *</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  className={errors.clientPhone ? 'border-red-500' : ''}
                />
                {errors.clientPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="clientEmail">Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                className={errors.clientEmail ? 'border-red-500' : ''}
              />
              {errors.clientEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Detalhes do Evento
            </h3>
            
            <div>
              <Label htmlFor="eventType">Tipo de Evento *</Label>
              <Input
                id="eventType"
                value={formData.eventType}
                onChange={(e) => handleInputChange('eventType', e.target.value)}
                placeholder="Ex: Casamento, Aniversário, Corporativo..."
                className={errors.eventType ? 'border-red-500' : ''}
              />
              {errors.eventType && (
                <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Data do Evento *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  className={errors.eventDate ? 'border-red-500' : ''}
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="eventTime">Hora do Evento *</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleInputChange('eventTime', e.target.value)}
                  className={errors.eventTime ? 'border-red-500' : ''}
                />
                {errors.eventTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventTime}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="eventLocation">Local do Evento *</Label>
              <Input
                id="eventLocation"
                value={formData.eventLocation}
                onChange={(e) => handleInputChange('eventLocation', e.target.value)}
                className={errors.eventLocation ? 'border-red-500' : ''}
              />
              {errors.eventLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.eventLocation}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestCount">Número de Convidados *</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="1"
                  value={formData.guestCount || ''}
                  onChange={(e) => handleInputChange('guestCount', Number(e.target.value) || 0)}
                  className={errors.guestCount ? 'border-red-500' : ''}
                />
                {errors.guestCount && (
                  <p className="text-red-500 text-sm mt-1">{errors.guestCount}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="budget">Orçamento Estimado (AOA) *</Label>
                <Input
                  id="budget"
                  type="number"
                  min="1"
                  value={formData.budget || ''}
                  onChange={(e) => handleInputChange('budget', Number(e.target.value) || 0)}
                  className={errors.budget ? 'border-red-500' : ''}
                />
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
                )}
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests">Pedidos Especiais</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Descreva qualquer pedido especial, restrições alimentares, decoração específica..."
              rows={4}
            />
          </div>

          {/* First Order Discount Info */}
          {isFirstOrder && formData.budget > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <Gift className="h-4 w-4" />
                Desconto do Primeiro Evento
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-green-700">
                  Orçamento original: {formData.budget.toLocaleString('pt-AO', { 
                    style: 'currency', 
                    currency: 'AOA' 
                  })}
                </p>
                <p className="text-green-700">
                  Desconto (10%): -{(formData.budget * discount).toLocaleString('pt-AO', { 
                    style: 'currency', 
                    currency: 'AOA' 
                  })}
                </p>
                <p className="text-green-800 font-semibold">
                  Valor final: {(formData.budget * (1 - discount)).toLocaleString('pt-AO', { 
                    style: 'currency', 
                    currency: 'AOA' 
                  })}
                </p>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90"
          >
            Enviar Solicitação de Orçamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventForm;
