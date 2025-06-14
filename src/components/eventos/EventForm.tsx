
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Gift } from "lucide-react";
import { useFirstOrder } from "@/hooks/use-first-order";
import { useToast } from "@/hooks/use-toast";
import EventFormData from "./EventFormData";
import EventDetails from "./EventDetails";

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
          <EventFormData 
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
          
          <EventDetails 
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />

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
