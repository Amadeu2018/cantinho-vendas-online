
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Users, MapPin, Clock, Package } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useFirstOrder } from "@/hooks/use-first-order";

interface EventPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  includes: string[];
  minGuests: number;
  maxGuests: number;
}

interface EventFormProps {
  selectedPackage?: EventPackage;
  onSubmit: (eventData: any) => void;
}

const EventForm = ({ selectedPackage, onSubmit }: EventFormProps) => {
  const { toast } = useToast();
  const { isFirstOrder, discount } = useFirstOrder();
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    eventType: "",
    guestCount: selectedPackage?.minGuests || 50,
    location: "",
    specialRequests: "",
    budget: selectedPackage?.price || 0
  });

  const eventPackages: EventPackage[] = [
    {
      id: "basic",
      name: "Pacote Básico",
      description: "Ideal para eventos pequenos e íntimos",
      price: 50000,
      includes: ["Muamba de galinha", "Arroz de coco", "Bebidas básicas"],
      minGuests: 20,
      maxGuests: 50
    },
    {
      id: "standard",
      name: "Pacote Standard",
      description: "Perfeito para celebrações familiares",
      price: 85000,
      includes: ["Calulu de peixe", "Funge", "Muamba de galinha", "Bebidas variadas"],
      minGuests: 50,
      maxGuests: 100
    },
    {
      id: "premium",
      name: "Pacote Premium",
      description: "Para eventos especiais e corporativos",
      price: 150000,
      includes: ["Menu completo", "Serviço de garçons", "Decoração básica", "Bebidas premium"],
      minGuests: 100,
      maxGuests: 200
    }
  ];

  const currentPackage = selectedPackage || eventPackages.find(p => p.id === "premium") || eventPackages[0];
  const finalPrice = isFirstOrder ? currentPackage.price * (1 - discount) : currentPackage.price;
  const savings = currentPackage.price - finalPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Data necessária",
        description: "Por favor, selecione a data do evento",
        variant: "destructive"
      });
      return;
    }

    const eventData = {
      ...formData,
      date: date.toISOString(),
      package: currentPackage,
      finalPrice,
      savings: isFirstOrder ? savings : 0
    };

    onSubmit(eventData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* First Order Discount Banner */}
      {isFirstOrder && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Package className="w-5 h-5" />
              <div>
                <p className="font-semibold">🎉 Primeiro Evento - Desconto Especial!</p>
                <p className="text-sm">
                  Economize {(discount * 100).toFixed(0)}% no seu primeiro evento conosco
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Package Summary */}
        <Card className="lg:sticky lg:top-6 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-cantinho-navy">
              <Package className="w-5 h-5" />
              Pacote Selecionado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">{currentPackage.name}</h3>
              <p className="text-gray-600 text-sm">{currentPackage.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Inclui:</h4>
              <ul className="space-y-1">
                {currentPackage.includes.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cantinho-terracotta rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Convidados:</span>
                <span>{currentPackage.minGuests} - {currentPackage.maxGuests} pessoas</span>
              </div>
              
              {isFirstOrder && savings > 0 ? (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Preço original:</span>
                    <span className="text-sm line-through text-gray-500">
                      {currentPackage.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Desconto ({(discount * 100).toFixed(0)}%):</span>
                    <span className="text-sm text-green-600 font-medium">
                      -{savings.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-cantinho-terracotta">
                      {finalPrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-cantinho-terracotta">
                    {currentPackage.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Event Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-cantinho-navy">Detalhes do Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-cantinho-navy">Informações de Contato</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Nome Completo *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+244 9XX XXX XXX"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-cantinho-navy">Detalhes do Evento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">Tipo de Evento *</Label>
                    <Input
                      id="eventType"
                      value={formData.eventType}
                      onChange={(e) => handleInputChange('eventType', e.target.value)}
                      placeholder="Ex: Casamento, Aniversário, Corporativo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="guestCount">Número de Convidados *</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      value={formData.guestCount}
                      onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                      min={currentPackage.minGuests}
                      max={currentPackage.maxGuests}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Data do Evento *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: ptBR }) : "Selecionar data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Local do Evento *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Endereço completo"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialRequests">Solicitações Especiais</Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Descreva qualquer solicitação especial, restrições alimentares, decoração específica, etc."
                    rows={4}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white py-3 text-lg font-semibold"
              >
                {isFirstOrder ? 'Solicitar Orçamento com Desconto' : 'Solicitar Orçamento'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventForm;
