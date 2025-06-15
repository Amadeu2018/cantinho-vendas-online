
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building, Mail, MapPin, Hash, Image, Phone } from "lucide-react";
import { CompanySettings } from "@/hooks/company/use-company-settings";

interface CompanyInfoSettingsProps {
  settings: CompanySettings;
  onSettingsChange: (settings: Partial<CompanySettings>) => void;
}

const CompanyInfoSettings = ({ settings, onSettingsChange }: CompanyInfoSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informações da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome da Empresa
            </label>
            <Input
              type="text"
              placeholder="Cantinho Angolano"
              value={settings.company_name || ""}
              onChange={(e) => onSettingsChange({ company_name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <Hash className="h-4 w-4 inline mr-1" />
              NIF da Empresa
            </label>
            <Input
              type="text"
              placeholder="123456789"
              value={settings.company_nif || ""}
              onChange={(e) => onSettingsChange({ company_nif: e.target.value })}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              <Mail className="h-4 w-4 inline mr-1" />
              Email da Empresa
            </label>
            <Input
              type="email"
              placeholder="contato@cantinhoangolano.com"
              value={settings.company_email || ""}
              onChange={(e) => onSettingsChange({ company_email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              <Phone className="h-4 w-4 inline mr-1" />
              Telefone da Empresa
            </label>
            <Input
              type="tel"
              placeholder="+244 xxx xxx xxx"
              value={settings.company_phone || ""}
              onChange={(e) => onSettingsChange({ company_phone: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            <MapPin className="h-4 w-4 inline mr-1" />
            Endereço da Empresa
          </label>
          <Textarea
            placeholder="Rua Principal, Luanda, Angola"
            value={settings.company_address || ""}
            onChange={(e) => onSettingsChange({ company_address: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            <Image className="h-4 w-4 inline mr-1" />
            URL do Logo
          </label>
          <Input
            type="url"
            placeholder="https://exemplo.com/logo.png"
            value={settings.company_logo_url || ""}
            onChange={(e) => onSettingsChange({ company_logo_url: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoSettings;
