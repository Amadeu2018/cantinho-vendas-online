
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Phone, Plus, Trash2, Edit } from "lucide-react";
import { useMulticaixaAccounts, MulticaixaAccount } from "@/hooks/company/use-multicaixa-accounts";

const MulticaixaAccountsManager = () => {
  const { accounts, loading, addAccount, updateAccount, removeAccount } = useMulticaixaAccounts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<MulticaixaAccount | null>(null);
  const [formData, setFormData] = useState<Omit<MulticaixaAccount, 'id'>>({
    phone_number: "",
    account_name: "",
    is_primary: false,
    is_active: true,
  });

  const handleSubmit = async () => {
    if (editingAccount?.id) {
      await updateAccount(editingAccount.id, formData);
      setEditingAccount(null);
    } else {
      await addAccount(formData);
    }
    setIsAddDialogOpen(false);
    setFormData({
      phone_number: "",
      account_name: "",
      is_primary: false,
      is_active: true,
    });
  };

  const handleEdit = (account: MulticaixaAccount) => {
    setEditingAccount(account);
    setFormData({
      phone_number: account.phone_number,
      account_name: account.account_name,
      is_primary: account.is_primary,
      is_active: account.is_active,
    });
    setIsAddDialogOpen(true);
  };

  if (loading) return <div>Carregando contas Multicaixa...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Multicaixa Express
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Conta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingAccount ? "Editar Conta Multicaixa" : "Nova Conta Multicaixa"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Número de Telefone</label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="9XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Titular</label>
                  <Input
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_primary}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_primary: checked })}
                  />
                  <label className="text-sm font-medium">Conta Principal</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <label className="text-sm font-medium">Ativa</label>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  {editingAccount ? "Atualizar" : "Adicionar"} Conta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhuma conta Multicaixa cadastrada</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{account.phone_number}</span>
                    {account.is_primary && <Badge variant="default">Principal</Badge>}
                    {!account.is_active && <Badge variant="secondary">Inativa</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{account.account_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(account)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => account.id && removeAccount(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MulticaixaAccountsManager;
