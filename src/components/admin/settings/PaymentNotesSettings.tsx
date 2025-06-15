
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard } from "lucide-react";
import { CompanySettings } from "@/hooks/company/use-company-settings";

interface PaymentNotesSettingsProps {
  settings: CompanySettings;
  onSettingsChange: (settings: Partial<CompanySettings>) => void;
}

const PaymentNotesSettings = ({ settings, onSettingsChange }: PaymentNotesSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Instruções de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Instruções especiais para pagamentos, prazos, etc..."
          value={settings.payment_notes || ""}
          onChange={(e) => onSettingsChange({ payment_notes: e.target.value })}
          rows={4}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentNotesSettings;
