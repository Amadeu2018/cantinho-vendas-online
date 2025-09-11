
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: string = "AOA", locale: string = "pt-AO"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(value);
}

export function downloadCSV(data: any[], filename: string, toast: (options: any) => void) {
  if (!data || data.length === 0) {
    if (toast) {
      toast({
        title: "Nenhum dado para exportar",
        description: "A seleção atual não contém dados para gerar o relatório.",
        variant: "default",
      });
    }
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let value = row[header];
        if (value === null || value === undefined) {
          return '';
        }
        let stringValue = String(value).replace(/"/g, '""');
        if (stringValue.includes(',')) {
          stringValue = `"${stringValue}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
