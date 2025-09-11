import { useCompanySettings } from "./company/use-company-settings";
import { formatCurrency } from "@/lib/utils";

export const useCurrency = () => {
  const { settings } = useCompanySettings();
  
  const formatPrice = (value: number): string => {
    const currency = settings.currency || "AOA";
    const locale = getLocaleFromCurrency(currency);
    return formatCurrency(value, currency, locale);
  };
  
  const getLocaleFromCurrency = (currency: string): string => {
    switch (currency) {
      case "EUR":
        return "pt-PT";
      case "USD":
        return "en-US";
      case "AOA":
      default:
        return "pt-AO";
    }
  };
  
  return { formatPrice, currency: settings.currency || "AOA" };
};