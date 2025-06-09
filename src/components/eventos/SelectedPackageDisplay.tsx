
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";
import { useEvent } from "@/contexts/EventContext";

const SelectedPackageDisplay = () => {
  const { selectedPackage, clearSelection } = useEvent();

  if (!selectedPackage) return null;

  return (
    <Card className="border-2 border-cantinho-terracotta/20 bg-cantinho-terracotta/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg text-cantinho-navy">Pacote Selecionado</CardTitle>
          <Badge variant="secondary" className="mt-1 bg-cantinho-terracotta text-white">
            {selectedPackage.name}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSelection}
          className="h-8 w-8 p-0 hover:bg-red-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Descrição:</p>
            <p className="text-sm font-medium">{selectedPackage.description}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Preço estimado:</p>
            <p className="text-lg font-bold text-cantinho-terracotta">
              {selectedPackage.price.toLocaleString('pt-AO', { 
                style: 'currency', 
                currency: 'AOA' 
              })} por pessoa
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Inclui:</p>
            <ul className="space-y-1">
              {selectedPackage.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-cantinho-terracotta flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedPackageDisplay;
