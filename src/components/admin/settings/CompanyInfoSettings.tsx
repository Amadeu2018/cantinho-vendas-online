
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building, Mail, MapPin, Hash, Image, Phone, Upload, X } from "lucide-react";
import { CompanySettings } from "@/hooks/company/use-company-settings";
import { useToast } from "@/hooks/use-toast";

interface CompanyInfoSettingsProps {
  settings: CompanySettings;
  onSettingsChange: (settings: Partial<CompanySettings>) => void;
}

const CompanyInfoSettings = ({ settings, onSettingsChange }: CompanyInfoSettingsProps) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "O arquivo deve ter no máximo 5MB.",
        variant: "destructive"
      });
      return;
    }

    setLogoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      // For now, we'll use the data URL as the logo URL
      // In a real app, you'd upload to storage first
      onSettingsChange({ company_logo_url: result });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    onSettingsChange({ company_logo_url: "" });
  };

  const currentLogo = logoPreview || settings.company_logo_url;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informações da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo Section */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <Image className="h-4 w-4 inline mr-1" />
            Logótipo da Empresa
          </label>
          
          <div className="flex items-start gap-4">
            {currentLogo && (
              <div className="relative">
                <img 
                  src={currentLogo} 
                  alt="Logo da empresa" 
                  className="w-24 h-24 object-contain border border-gray-200 rounded-lg bg-white p-2"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeLogo}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Clique para fazer upload do logótipo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG até 5MB
                  </p>
                </label>
              </div>
            </div>
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
};

export default CompanyInfoSettings;
