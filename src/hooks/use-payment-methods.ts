import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethod } from '@/contexts/CartContext';

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const methods: PaymentMethod[] = [
        {
          id: "cash",
          name: "Dinheiro na Entrega",
          icon: "💰"
        }
      ];

      // Fetch active bank accounts
      const { data: bankAccounts, error: bankError } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('is_active', true);

      if (bankError) {
        console.error('Error fetching bank accounts:', bankError);
      } else if (bankAccounts && bankAccounts.length > 0) {
        bankAccounts.forEach(account => {
          methods.push({
            id: `bank_${account.id}`,
            name: `Transferência - ${account.bank_name}`,
            icon: "🏦",
            details: {
              bank_name: account.bank_name,
              account_name: account.account_name,
              account_iban: account.account_iban,
              swift_code: account.swift_code
            }
          });
        });
      }

      // Fetch active multicaixa accounts
      const { data: multicaixaAccounts, error: multicaixaError } = await supabase
        .from('multicaixa_accounts')
        .select('*')
        .eq('is_active', true);

      if (multicaixaError) {
        console.error('Error fetching multicaixa accounts:', multicaixaError);
      } else if (multicaixaAccounts && multicaixaAccounts.length > 0) {
        multicaixaAccounts.forEach(account => {
          methods.push({
            id: `multicaixa_${account.id}`,
            name: `Multicaixa - ${account.account_name}`,
            icon: "💳",
            details: {
              account_name: account.account_name,
              phone_number: account.phone_number
            }
          });
        });
      }

      setPaymentMethods(methods);
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setError(err instanceof Error ? err.message : 'Error fetching payment methods');
      
      // Set default methods on error
      setPaymentMethods([
        {
          id: "cash",
          name: "Dinheiro na Entrega",
          icon: "💰"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();

    // Subscribe to payment method changes
    const bankSubscription = supabase
      .channel('bank_accounts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bank_accounts' 
        }, 
        () => {
          console.log('Bank accounts changed, refetching payment methods...');
          fetchPaymentMethods();
        }
      )
      .subscribe();

    const multicaixaSubscription = supabase
      .channel('multicaixa_accounts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'multicaixa_accounts' 
        }, 
        () => {
          console.log('Multicaixa accounts changed, refetching payment methods...');
          fetchPaymentMethods();
        }
      )
      .subscribe();

    return () => {
      bankSubscription.unsubscribe();
      multicaixaSubscription.unsubscribe();
    };
  }, []);

  return { paymentMethods, loading, error, refetch: fetchPaymentMethods };
};