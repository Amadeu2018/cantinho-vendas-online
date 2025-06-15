
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface AdminSettingsHeaderProps {
  saving: boolean;
  onSave: () => void;
}

const AdminSettingsHeader = ({ saving, onSave }: AdminSettingsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-cantinho-navy">Configurações da Empresa</h2>
      <Button onClick={onSave} disabled={saving}>
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Salvando..." : "Salvar Configurações"}
      </Button>
    </div>
  );
};

export default AdminSettingsHeader;
