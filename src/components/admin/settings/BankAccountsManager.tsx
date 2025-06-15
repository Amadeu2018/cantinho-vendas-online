
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Building2, Plus, Trash2, Edit } from "lucide-react";
import { useBankAccounts, BankAccount } from "@/hooks/company/use-bank-accounts";

const BankAccountsManager = () => {
  const { accounts, loading, addAccount, updateAccount, removeAccount } = useBankAccounts();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [formData, setFormData] = useState<Omit<BankAccount, 'id'>>({
    bank_name: "",
    account_name: "",
    account_iban: "",
    swift_code: "",
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
      bank_name: "",
      account_name: "",
      account_iban: "",
      swift_code: "",
      is_primary: false,
      is_active: true,
    });
  };

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account);
    setFormData({
      bank_name: account.bank_name,
      account_name: account.account_name,
      account_iban: account.account_iban,
      swift_code: account.swift_code || "",
      is_primary: account.is_primary,
      is_active: account.is_active,
    });
    setIsAddDialogOpen(true);
  };

  if (loading) return <div>Carregando contas bancárias...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Contas Bancárias
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
                  {editingAccount ? "Editar Conta Bancária" : "Nova Conta Bancária"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Banco</label>
                  <Input
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    placeholder="Ex: BAI, BFA, BIC..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Titular</label>
                  <Input
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">IBAN</label>
                  <Input
                    value={formData.account_iban}
                    onChange={(e) => setFormData({ ...formData, account_iban: e.target.value })}
                    placeholder="AO06.0000.0000.0000.0000.0000.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Código SWIFT (opcional)</label>
                  <Input
                    value={formData.swift_code}
                    onChange={(e) => setFormData({ ...formData, swift_code: e.target.value })}
                    placeholder="BAIPAOLU"
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
          <p className="text-gray-500 text-center py-4">Nenhuma conta bancária cadastrada</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{account.bank_name}</span>
                    {account.is_primary && <Badge variant="default">Principal</Badge>}
                    {!account.is_active && <Badge variant="secondary">Inativa</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{account.account_name}</p>
                  <p className="text-sm text-gray-500">{account.account_iban}</p>
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

export default BankAccountsManager;
