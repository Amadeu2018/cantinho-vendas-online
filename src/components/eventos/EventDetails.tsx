
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays } from "lucide-react";

interface EventDetailsProps {
  formData: any;
  errors: any;
  onInputChange: (field: string, value: string | number) => void;
}

const EventDetails = ({ formData, errors, onInputChange }: EventDetailsProps) => {
  return (
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
          onChange={(e) => onInputChange('eventType', e.target.value)}
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
            onChange={(e) => onInputChange('eventDate', e.target.value)}
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
            onChange={(e) => onInputChange('eventTime', e.target.value)}
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
          onChange={(e) => onInputChange('eventLocation', e.target.value)}
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
            onChange={(e) => onInputChange('guestCount', Number(e.target.value) || 0)}
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
            onChange={(e) => onInputChange('budget', Number(e.target.value) || 0)}
            className={errors.budget ? 'border-red-500' : ''}
          />
          {errors.budget && (
            <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="specialRequests">Pedidos Especiais</Label>
        <Textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => onInputChange('specialRequests', e.target.value)}
          placeholder="Descreva qualquer pedido especial, restrições alimentares, decoração específica..."
          rows={4}
        />
      </div>
    </div>
  );
};

export default EventDetails;
