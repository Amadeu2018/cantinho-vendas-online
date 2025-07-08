import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Flame, Users, Scale } from "lucide-react";
import { Dish, MeatDoneness } from "@/types/dish";

interface GrillCustomizationModalProps {
  dish: Dish;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizations: any) => void;
}

const GrillCustomizationModal = ({ dish, isOpen, onClose, onAddToCart }: GrillCustomizationModalProps) => {
  const [selectedDoneness, setSelectedDoneness] = useState<MeatDoneness>('ao ponto');
  const [selectedMarinade, setSelectedMarinade] = useState('tradicional');
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const availableMarinades = [
    'tradicional',
    'alho e ervas',
    'pimenta',
    'limão',
    'chimichurri',
    'molho barbecue'
  ];

  const availableSides = [
    'farofa',
    'vinagrete',
    'pão de alho',
    'salada verde',
    'arroz',
    'mandioca',
    'batata rústica'
  ];

  const handleSideChange = (side: string, checked: boolean) => {
    if (checked) {
      setSelectedSides([...selectedSides, side]);
    } else {
      setSelectedSides(selectedSides.filter(s => s !== side));
    }
  };

  const handleAddToCart = () => {
    const customizations = {
      doneness: selectedDoneness,
      marinade: selectedMarinade,
      sides: selectedSides,
      quantity,
      specialInstructions,
      unitPrice: dish.price
    };

    onAddToCart(customizations);
    onClose();
  };

  const totalPrice = dish.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-cantinho-terracotta" />
            Personalizar {dish.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do produto */}
          <div className="bg-cantinho-sand/20 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-cantinho-navy">
                {dish.price.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
              </span>
              <div className="flex gap-2">
                {dish.combo_serves && dish.combo_serves > 1 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {dish.combo_serves} pessoas
                  </Badge>
                )}
                {dish.sale_unit === 'kg' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Scale className="h-3 w-3" />
                    Por Kg
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-cantinho-navy/70">{dish.description}</p>
          </div>

          {/* Quantidade */}
          <div>
            <Label className="text-cantinho-navy font-semibold">
              Quantidade {dish.sale_unit === 'kg' ? '(Kg)' : ''}
            </Label>
            <div className="flex items-center gap-3 mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 0.5))}
              >
                -
              </Button>
              <span className="text-lg font-semibold min-w-[3rem] text-center">
                {quantity} {dish.sale_unit === 'kg' ? 'kg' : ''}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setQuantity(quantity + 0.5)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Ponto da carne */}
          {dish.meat_options && dish.meat_options.length > 0 && (
            <div>
              <Label className="text-cantinho-navy font-semibold">Ponto da Carne</Label>
              <RadioGroup 
                value={selectedDoneness} 
                onValueChange={(value) => setSelectedDoneness(value as MeatDoneness)}
                className="mt-2"
              >
                {dish.meat_options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="capitalize">{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Tempero/Marinada */}
          <div>
            <Label className="text-cantinho-navy font-semibold">Tempero/Marinada</Label>
            <RadioGroup 
              value={selectedMarinade} 
              onValueChange={setSelectedMarinade}
              className="mt-2"
            >
              {availableMarinades.map((marinade) => (
                <div key={marinade} className="flex items-center space-x-2">
                  <RadioGroupItem value={marinade} id={marinade} />
                  <Label htmlFor={marinade} className="capitalize">{marinade}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Acompanhamentos */}
          <div>
            <Label className="text-cantinho-navy font-semibold">
              Acompanhamentos (opcional)
            </Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {availableSides.map((side) => (
                <div key={side} className="flex items-center space-x-2">
                  <Checkbox 
                    id={side}
                    checked={selectedSides.includes(side)}
                    onCheckedChange={(checked) => handleSideChange(side, checked as boolean)}
                  />
                  <Label htmlFor={side} className="capitalize text-sm">{side}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Observações especiais */}
          <div>
            <Label htmlFor="instructions" className="text-cantinho-navy font-semibold">
              Observações Especiais
            </Label>
            <Textarea
              id="instructions"
              placeholder="Ex: sem sal, sem pimenta, bem temperado..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Resumo e ação */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-cantinho-navy">Total:</span>
              <span className="text-2xl font-bold text-cantinho-terracotta">
                {totalPrice.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-cantinho-terracotta hover:bg-cantinho-terracotta/90 text-white"
              >
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrillCustomizationModal;