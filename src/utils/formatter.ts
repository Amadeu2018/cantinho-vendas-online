
/**
 * Formats a number as currency in Angolan Kwanza (AOA)
 * @param price - The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-AO', { 
    style: 'currency', 
    currency: 'AOA',
    minimumFractionDigits: 0
  }).format(price);
};
