
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface MulticaixaAccount {
  id?: string;
  phone_number: string;
  account_name: string;
  is_primary: boolean;
  is_active: boolean;
}

export const useMulticaixaAccounts = () => {
  const [accounts, setAccounts] = useState<MulticaixaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("multicaixa_accounts")
        .select("*")
        .order("is_primary", { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error("Erro ao carregar contas Multicaixa:", error);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (account: Omit<MulticaixaAccount, 'id'>) => {
    try {
      // Se for conta primária, remover primária das outras
      if (account.is_primary) {
        await supabase
          .from("multicaixa_accounts")
          .update({ is_primary: false })
          .neq("id", "");
      }

      const { error } = await supabase
        .from("multicaixa_accounts")
        .insert(account);

      if (error) throw error;

      await fetchAccounts();
      toast({
        title: "Conta adicionada",
        description: "Conta Multicaixa adicionada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateAccount = async (id: string, updates: Partial<MulticaixaAccount>) => {
    try {
      // Se for conta primária, remover primária das outras
      if (updates.is_primary) {
        await supabase
          .from("multicaixa_accounts")
          .update({ is_primary: false })
          .neq("id", id);
      }

      const { error } = await supabase
        .from("multicaixa_accounts")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      await fetchAccounts();
      toast({
        title: "Conta atualizada",
        description: "Conta Multicaixa atualizada com sucesso.",
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
        .from("multicaixa_accounts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await fetchAccounts();
      toast({
        title: "Conta removida",
        description: "Conta Multicaixa removida com sucesso.",
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
