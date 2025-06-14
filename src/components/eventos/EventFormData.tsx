
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface EventFormDataProps {
  formData: any;
  errors: any;
  onInputChange: (field: string, value: string | number) => void;
}

const EventFormData = ({ formData, errors, onInputChange }: EventFormDataProps) => {
  return (
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
            onChange={(e) => onInputChange('clientName', e.target.value)}
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
            onChange={(e) => onInputChange('clientPhone', e.target.value)}
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
          onChange={(e) => onInputChange('clientEmail', e.target.value)}
          className={errors.clientEmail ? 'border-red-500' : ''}
        />
        {errors.clientEmail && (
          <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>
        )}
      </div>
    </div>
  );
};

export default EventFormData;
