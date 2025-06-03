
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return false;
  }
};

export const generateFinancialReport = (data: any[], period: string) => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.text('Relatório Financeiro', 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Período: ${period}`, 20, 50);
  pdf.text(`Gerado em: ${new Date().toLocaleString('pt-AO')}`, 20, 60);
  
  // Summary
  let yPosition = 80;
  pdf.setFontSize(14);
  pdf.text('Resumo:', 20, yPosition);
  
  yPosition += 20;
  pdf.setFontSize(10);
  
  const totalRevenue = data.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalOrders = data.length;
  
  pdf.text(`Total de Pedidos: ${totalOrders}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Receita Total: ${totalRevenue.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}`, 20, yPosition);
  yPosition += 10;
  pdf.text(`Valor Médio: ${totalOrders > 0 ? (totalRevenue / totalOrders).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : '0'}`, 20, yPosition);
  
  // Table header
  yPosition += 30;
  pdf.setFontSize(12);
  pdf.text('Detalhes dos Pedidos:', 20, yPosition);
  
  yPosition += 15;
  pdf.setFontSize(8);
  pdf.text('ID', 20, yPosition);
  pdf.text('Data', 50, yPosition);
  pdf.text('Cliente', 90, yPosition);
  pdf.text('Total', 140, yPosition);
  pdf.text('Status', 170, yPosition);
  
  // Table content
  yPosition += 10;
  data.slice(0, 30).forEach((order) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 30;
    }
    
    const orderId = order.id ? order.id.slice(0, 8) : 'N/A';
    const orderDate = new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString('pt-AO');
    const customerName = order.customer_name || (order.customerInfo && order.customerInfo.name) || 'Cliente';
    const total = (order.total || 0).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
    const status = order.status || 'pending';
    
    pdf.text(orderId, 20, yPosition);
    pdf.text(orderDate, 50, yPosition);
    pdf.text(customerName.substring(0, 20), 90, yPosition);
    pdf.text(total, 140, yPosition);
    pdf.text(status, 170, yPosition);
    
    yPosition += 8;
  });
  
  pdf.save(`relatorio-financeiro-${period}-${Date.now()}.pdf`);
};

export const generateInventoryReport = (inventory: any[]) => {
  const pdf = new jsPDF();
  
  pdf.setFontSize(20);
  pdf.text('Relatório de Inventário', 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Gerado em: ${new Date().toLocaleString('pt-AO')}`, 20, 50);
  
  let yPosition = 70;
  pdf.setFontSize(14);
  pdf.text('Produtos em Estoque:', 20, yPosition);
  
  yPosition += 20;
  pdf.setFontSize(8);
  pdf.text('Nome', 20, yPosition);
  pdf.text('Categoria', 80, yPosition);
  pdf.text('Estoque', 120, yPosition);
  pdf.text('Mín. Estoque', 150, yPosition);
  pdf.text('Preço', 180, yPosition);
  
  yPosition += 10;
  inventory.forEach((item) => {
    if (yPosition > 270) {
      pdf.addPage();
      yPosition = 30;
    }
    
    pdf.text(item.name?.substring(0, 25) || 'N/A', 20, yPosition);
    pdf.text(item.category_name?.substring(0, 15) || 'N/A', 80, yPosition);
    pdf.text(String(item.stock_quantity || 0), 120, yPosition);
    pdf.text(String(item.min_stock_quantity || 0), 150, yPosition);
    pdf.text((item.price || 0).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }), 180, yPosition);
    
    yPosition += 8;
  });
  
  pdf.save(`relatorio-inventario-${Date.now()}.pdf`);
};
