import { useCompanySettings } from "./company/use-company-settings";

export const useCurrency = () => {
  const { settings, loading } = useCompanySettings();
  
  const formatPrice = (value: number): string => {
    const currency = settings.currency || "AOA";
    const locale = getLocaleFromCurrency(currency);
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
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
  
  return { 
    formatPrice, 
    currency: settings.currency || "AOA",
    loading
  };
};