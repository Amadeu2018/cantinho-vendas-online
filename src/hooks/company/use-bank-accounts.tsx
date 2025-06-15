
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface BankAccount {
  id?: string;
  bank_name: string;
  account_name: string;
  account_iban: string;
  swift_code?: string;
  is_primary: boolean;
  is_active: boolean;
}

export const useBankAccounts = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .order("is_primary", { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error("Erro ao carregar contas bancárias:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (account: Omit<BankAccount, 'id'>) => {
    try {
      // Se for conta primária, remover primária das outras
      if (account.is_primary) {
        await supabase
          .from("bank_accounts")
          .update({ is_primary: false })
          .neq("id", "");
      }

      const { error } = await supabase
        .from("bank_accounts")
        .insert(account);

      if (error) throw error;

      await fetchAccounts();
      toast({
        title: "Conta adicionada",
        description: "Conta bancária adicionada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
    try {
      // Se for conta primária, remover primária das outras
      if (updates.is_primary) {
        await supabase
          .from("bank_accounts")
          .update({ is_primary: false })
          .neq("id", id);
      }

      const { error } = await supabase
        .from("bank_accounts")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      await fetchAccounts();
      toast({
        title: "Conta atualizada",
        description: "Conta bancária atualizada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bank_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchAccounts();
      toast({
        title: "Conta removida",
        description: "Conta bancária removida com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { accounts, loading, addAccount, updateAccount, removeAccount, refreshAccounts: fetchAccounts };
};
