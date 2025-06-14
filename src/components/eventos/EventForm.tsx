import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Clock, Phone, Mail, User } from "lucide-react";
import { EventFormData } from "./EventFormData";
import { toast } from "sonner";

interface EventFormProps {
  selectedPackage: any;
  onFormSubmit: (formData: EventFormData) => void;
  onBack: () => void;
}

const EventForm = ({ selectedPackage, onFormSubmit, onBack }: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    eventDate: null,
    eventTime: "",
    venue: "",
    guestCount: 1,
    additionalRequests: "",
    selectedPackageName: selectedPackage?.name || "Pacote Personalizado",
    totalPrice: selectedPackage?.price || 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

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

    if (!formData.eventDate) {
      newErrors.eventDate = "Data do evento é obrigatória";
    }

    if (!formData.eventTime.trim()) {
      newErrors.eventTime = "Hora do evento é obrigatória";
    }

    if (!formData.venue.trim()) {
      newErrors.venue = "Local do evento é obrigatório";
    }

    if (!formData.guestCount || formData.guestCount < 1) {
      newErrors.guestCount = "Número de convidados deve ser maior que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert string values to numbers where needed
      const processedFormData = {
        ...formData,
        guestCount: parseInt(formData.guestCount.toString()),
        totalPrice: parseFloat(formData.totalPrice.toString())
      };
      
      onFormSubmit(processedFormData);
      toast.success("Pedido de evento enviado com sucesso!");
    } else {
      toast.error("Por favor, corrija os erros no formulário");
    }
  };

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cantinho-navy">Detalhes do Evento</h2>
        <p className="text-gray-600">
          Preencha o formulário abaixo para solicitar um orçamento para o seu evento.
        </p>
        <Separator className="my-4" />
        <Badge variant="secondary">
          Pacote Selecionado: {selectedPackage?.name || "Personalizado"}
        </Badge>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                <User className="inline-block h-4 w-4 mr-1" />
                Nome Completo
              </Label>
              <Input
                type="text"
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                className="mt-1"
              />
              {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
            </div>
            <div>
              <Label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
                <Mail className="inline-block h-4 w-4 mr-1" />
                Email
              </Label>
              <Input
                type="email"
                id="clientEmail"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                className="mt-1"
              />
              {errors.clientEmail && <p className="text-red-500 text-xs mt-1">{errors.clientEmail}</p>}
            </div>
            <div>
              <Label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">
                <Phone className="inline-block h-4 w-4 mr-1" />
                Telefone
              </Label>
              <Input
                type="tel"
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                className="mt-1"
              />
              {errors.clientPhone && <p className="text-red-500 text-xs mt-1">{errors.clientPhone}</p>}
            </div>
            <div>
              <Label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                <Users className="inline-block h-4 w-4 mr-1" />
                Número de Convidados
              </Label>
              <Input
                type="number"
                id="guestCount"
                value={formData.guestCount}
                onChange={(e) => handleInputChange("guestCount", e.target.value)}
                className="mt-1"
              />
              {errors.guestCount && <p className="text-red-500 text-xs mt-1">{errors.guestCount}</p>}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                <Calendar className="inline-block h-4 w-4 mr-1" />
                Data do Evento
              </Label>
              <Input
                type="date"
                id="eventDate"
                value={formData.eventDate || ""}
                onChange={(e) => handleInputChange("eventDate", e.target.value)}
                className="mt-1"
              />
              {errors.eventDate && <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>}
            </div>
            <div>
              <Label htmlFor="eventTime" className="block text-sm font-medium text-gray-700">
                <Clock className="inline-block h-4 w-4 mr-1" />
                Hora do Evento
              </Label>
              <Input
                type="time"
                id="eventTime"
                value={formData.eventTime}
                onChange={(e) => handleInputChange("eventTime", e.target.value)}
                className="mt-1"
              />
              {errors.eventTime && <p className="text-red-500 text-xs mt-1">{errors.eventTime}</p>}
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="venue" className="block text-sm font-medium text-gray-700">
              <MapPin className="inline-block h-4 w-4 mr-1" />
              Local do Evento
            </Label>
            <Input
              type="text"
              id="venue"
              value={formData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              className="mt-1"
            />
            {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue}</p>}
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <Label htmlFor="additionalRequests" className="block text-sm font-medium text-gray-700">
              Pedidos Adicionais
            </Label>
            <Textarea
              id="additionalRequests"
              rows={3}
              value={formData.additionalRequests}
              onChange={(e) => handleInputChange("additionalRequests", e.target.value)}
              className="mt-1"
            />
          </div>
        </Card>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">Enviar Pedido</Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
