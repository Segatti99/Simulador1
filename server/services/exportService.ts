import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';

interface ExportData {
  simulationName: string;
  purchaseData: any;
  salesData: any;
  calculatedValues: any;
  reverseCalculation: any;
  targetPrice: number;
  exportDate: string;
}

export const createExcelExport = async (data: ExportData): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Simulação ST');

  // Add title and simulation name
  worksheet.addRow(['SIMULADOR DE PRECIFICAÇÃO COM SUBSTITUIÇÃO TRIBUTÁRIA']);
  worksheet.addRow(['Filial MG - Operações de Atacado']);
  worksheet.addRow([]);
  worksheet.addRow(['SIMULAÇÃO:', data.simulationName]);
  worksheet.addRow(['Data de Exportação:', new Date(data.exportDate).toLocaleDateString('pt-BR')]);
  worksheet.addRow([]);

  // Purchase Data Section
  worksheet.addRow(['DADOS DE COMPRA']);
  worksheet.addRow(['Custo de Compra (R$):', data.purchaseData.costoPurchase]);
  worksheet.addRow(['IPI Compra (%):', data.purchaseData.ipiPurchase]);
  worksheet.addRow(['ICMS Compra (%):', data.purchaseData.icmsPurchase]);
  worksheet.addRow(['PIS/COFINS Compra (%):', data.purchaseData.piscofinsPurchase]);
  worksheet.addRow(['Frete (%):', data.purchaseData.freight]);
  worksheet.addRow([]);

  // CMV Calculation Section
  worksheet.addRow(['CÁLCULO DO CMV']);
  worksheet.addRow(['Valor do IPI (R$):', data.calculatedValues.ipiValue]);
  worksheet.addRow(['Valor ICMS Compra (R$):', data.calculatedValues.icmsValue]);
  worksheet.addRow(['Valor PIS/COFINS (R$):', data.calculatedValues.piscofinsValue]);
  worksheet.addRow(['Valor do Frete (R$):', data.calculatedValues.freightValue]);
  worksheet.addRow(['CMV Final (R$):', data.calculatedValues.cmvFinal]);
  worksheet.addRow([]);

  // Sales Data Section
  worksheet.addRow(['IMPOSTOS E MARGENS DE VENDA']);
  worksheet.addRow(['ICMS Venda (%):', data.salesData.icmsSale]);
  worksheet.addRow(['PIS/COFINS Venda (%):', data.salesData.piscofinsSale]);
  worksheet.addRow(['Devolução (%):', data.salesData.devolution]);
  worksheet.addRow(['Margem Bruta (%):', data.salesData.grossMargin]);
  worksheet.addRow(['Flex (%):', data.salesData.flex]);
  worksheet.addRow(['MVA (%):', data.salesData.mva]);
  worksheet.addRow(['Fator Condição de Pagamento:', data.salesData.paymentCondition]);
  worksheet.addRow([]);

  // Pricing Results Section
  worksheet.addRow(['RESULTADOS DA PRECIFICAÇÃO']);
  worksheet.addRow(['Preço sem ST (R$):', data.calculatedValues.priceWithoutST]);
  worksheet.addRow(['Base ST (R$):', data.calculatedValues.baseST]);
  worksheet.addRow(['ST Débito (R$):', data.calculatedValues.stDebit]);
  worksheet.addRow(['ST Crédito (R$):', data.calculatedValues.stCredit]);
  worksheet.addRow(['Valor ST (R$):', data.calculatedValues.stValue]);
  worksheet.addRow(['Preço com ST (R$):', data.calculatedValues.priceWithST]);
  worksheet.addRow(['Preço com ST - FLEX (R$):', data.calculatedValues.priceWithSTFlex]);
  worksheet.addRow(['Markup (%):', data.calculatedValues.markup]);
  worksheet.addRow([]);

  // Reverse Calculation Section
  if (data.targetPrice > 0) {
    worksheet.addRow(['SIMULAÇÃO REVERSA']);
    worksheet.addRow(['Preço Alvo (R$):', data.targetPrice]);
    worksheet.addRow(['Custo de Compra Ideal (R$):', data.reverseCalculation.idealCost]);
    worksheet.addRow(['Margem Bruta Ideal (%):', data.reverseCalculation.idealMargin]);
    worksheet.addRow(['Markup do Preço Alvo (%):', data.reverseCalculation.targetMarkup]);
  }

  // Enhanced styling
  worksheet.getColumn(1).width = 35;
  worksheet.getColumn(2).width = 25;
  
  // Title styling
  const titleRow = worksheet.getRow(1);
  titleRow.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  titleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2980B9' } };
  titleRow.alignment = { horizontal: 'center' };
  worksheet.mergeCells('A1:B1');
  
  const subtitleRow = worksheet.getRow(2);
  subtitleRow.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  subtitleRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3498DB' } };
  subtitleRow.alignment = { horizontal: 'center' };
  worksheet.mergeCells('A2:B2');
  
  // Simulation name highlighting
  const simNameRow = worksheet.getRow(4);
  simNameRow.font = { bold: true, size: 14, color: { argb: 'FF000000' } };
  simNameRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC107' } };
  worksheet.mergeCells('A4:B4');
  
  // Section headers styling
  const sectionHeaders = [6, 13, 20, 27];
  sectionHeaders.forEach(rowNumber => {
    const row = worksheet.getRow(rowNumber);
    row.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34495E' } };
    worksheet.mergeCells(`A${rowNumber}:B${rowNumber}`);
  });
  
  // Data rows styling
  for (let i = 7; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    if (!sectionHeaders.includes(i) && i !== 1 && i !== 2 && i !== 4) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F9FA' } };
      if (row.getCell(1).value) {
        row.getCell(1).font = { bold: false };
        row.getCell(2).font = { bold: true };
      }
    }
  }
  
  // Add borders to all cells
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } }
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};

export const createPDFExport = (data: ExportData): Buffer => {
  const doc = new jsPDF();
  
  // Set default font to Arial for better character support
  doc.setFont('helvetica', 'normal');
  
  // Header with professional blue background
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 50, 'F');
  
  // Title in white with proper encoding
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('SIMULADOR DE PRECIFICACAO', 105, 20, { align: 'center' });
  doc.text('COM SUBSTITUICAO TRIBUTARIA', 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('Filial MG - Operacoes de Atacado', 105, 40, { align: 'center' });
  
  // Simulation name highlight with clean styling
  doc.setFillColor(255, 193, 7);
  doc.rect(0, 50, 210, 20, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(data.simulationName, 105, 63, { align: 'center' });
  
  // Date info section
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(220, 220, 220);
  doc.rect(15, 75, 180, 15, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Data de Exportacao: ${new Date(data.exportDate).toLocaleDateString('pt-BR')}`, 20, 83);
  doc.text(`Gerado as: ${new Date().toLocaleTimeString('pt-BR')}`, 140, 83);

  let yPosition = 100;

  // Helper function to draw tables
  const drawTable = (title: string, data: Array<{label: string, value: string}>, startY: number, highlight?: boolean) => {
    // Section title
    doc.setFillColor(52, 73, 94);
    doc.rect(15, startY, 180, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(title, 20, startY + 8);
    
    let currentY = startY + 18;
    
    // Table header
    doc.setFillColor(236, 240, 241);
    doc.setTextColor(0, 0, 0);
    doc.rect(15, currentY, 180, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('ITEM', 20, currentY + 5);
    doc.text('VALOR', 140, currentY + 5);
    currentY += 8;
    
    // Table rows
    data.forEach((row, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(249, 249, 249);
        doc.rect(15, currentY, 180, 8, 'F');
      }
      
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, currentY, 180, 8, 'D');
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(row.label, 20, currentY + 5);
      
      doc.setFont('helvetica', 'bold');
      doc.text(row.value, 140, currentY + 5);
      
      currentY += 8;
    });
    
    return currentY + 10;
  };

  // Purchase Data Section
  const purchaseData = [
    { label: 'Custo de Compra', value: `R$ ${data.purchaseData.costoPurchase.toFixed(2)}` },
    { label: 'IPI Compra', value: `${data.purchaseData.ipiPurchase.toFixed(2)}%` },
    { label: 'ICMS Compra', value: `${data.purchaseData.icmsPurchase.toFixed(2)}%` },
    { label: 'PIS/COFINS Compra', value: `${data.purchaseData.piscofinsPurchase.toFixed(2)}%` },
    { label: 'Frete', value: `${data.purchaseData.freight.toFixed(2)}%` }
  ];
  
  yPosition = drawTable('DADOS DE COMPRA', purchaseData, yPosition);

  // CMV Calculation Section
  const cmvData = [
    { label: 'Valor do IPI', value: `R$ ${data.calculatedValues.ipiValue.toFixed(2)}` },
    { label: 'Valor ICMS Compra', value: `R$ ${data.calculatedValues.icmsValue.toFixed(2)}` },
    { label: 'Valor PIS/COFINS', value: `R$ ${data.calculatedValues.piscofinsValue.toFixed(2)}` },
    { label: 'Valor do Frete', value: `R$ ${data.calculatedValues.freightValue.toFixed(2)}` }
  ];
  
  yPosition = drawTable('CALCULO DO CMV', cmvData, yPosition);
  
  // CMV Final highlight
  doc.setFillColor(231, 76, 60);
  doc.rect(15, yPosition - 5, 180, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`CMV FINAL: R$ ${data.calculatedValues.cmvFinal.toFixed(2)}`, 20, yPosition + 5);
  doc.setTextColor(0, 0, 0);
  yPosition += 20;

  // Add new page if needed
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }

  // Sales Data Section
  const salesDataArray = [
    { label: 'ICMS Venda', value: `${data.salesData.icmsSale.toFixed(2)}%` },
    { label: 'PIS/COFINS Venda', value: `${data.salesData.piscofinsSale.toFixed(2)}%` },
    { label: 'Devolucao', value: `${data.salesData.devolution.toFixed(2)}%` },
    { label: 'Margem Bruta', value: `${data.salesData.grossMargin.toFixed(2)}%` },
    { label: 'Flex', value: `${data.salesData.flex.toFixed(2)}%` },
    { label: 'MVA', value: `${data.salesData.mva.toFixed(2)}%` },
    { label: 'Fator Condicao Pagamento', value: `${data.salesData.paymentCondition.toFixed(4)}` }
  ];
  
  yPosition = drawTable('IMPOSTOS E MARGENS DE VENDA', salesDataArray, yPosition);

  // Add new page if needed
  if (yPosition > 180) {
    doc.addPage();
    yPosition = 20;
  }

  // Pricing Results Section
  const pricingData = [
    { label: 'Preco sem ST', value: `R$ ${data.calculatedValues.priceWithoutST.toFixed(2)}` },
    { label: 'Base ST', value: `R$ ${data.calculatedValues.baseST.toFixed(2)}` },
    { label: 'ST Debito', value: `R$ ${data.calculatedValues.stDebit.toFixed(2)}` },
    { label: 'ST Credito', value: `R$ ${data.calculatedValues.stCredit.toFixed(2)}` },
    { label: 'Valor ST', value: `R$ ${data.calculatedValues.stValue.toFixed(2)}` }
  ];
  
  yPosition = drawTable('RESULTADOS DA PRECIFICACAO', pricingData, yPosition);
  
  // Key results highlights
  doc.setFillColor(46, 204, 113);
  doc.rect(15, yPosition, 85, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PRECO COM ST', 17, yPosition + 7);
  doc.setFontSize(13);
  doc.text(`R$ ${data.calculatedValues.priceWithST.toFixed(2)}`, 17, yPosition + 14);
  
  doc.setFillColor(52, 152, 219);
  doc.rect(110, yPosition, 85, 18, 'F');
  doc.setFontSize(11);
  doc.text('PRECO FINAL (-FLEX)', 112, yPosition + 7);
  doc.setFontSize(13);
  doc.text(`R$ ${data.calculatedValues.priceWithSTFlex.toFixed(2)}`, 112, yPosition + 14);
  
  yPosition += 25;
  
  doc.setFillColor(155, 89, 182);
  doc.rect(15, yPosition, 180, 15, 'F');
  doc.setFontSize(12);
  doc.text(`MARKUP: ${data.calculatedValues.markup.toFixed(2)}%`, 20, yPosition + 9);
  doc.setTextColor(0, 0, 0);
  yPosition += 25;

  // Reverse Calculation Section
  if (data.targetPrice > 0) {
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 20;
    }
    
    const reverseData = [
      { label: 'Preco Alvo', value: `R$ ${data.targetPrice.toFixed(2)}` },
      { label: 'Custo de Compra Ideal', value: `R$ ${data.reverseCalculation.idealCost.toFixed(2)}` },
      { label: 'Margem Bruta Ideal', value: `${data.reverseCalculation.idealMargin.toFixed(2)}%` },
      { label: 'Markup do Preco Alvo', value: `${data.reverseCalculation.targetMarkup.toFixed(2)}%` }
    ];
    
    yPosition = drawTable('SIMULACAO REVERSA', reverseData, yPosition);
    
    // Target price highlight
    doc.setFillColor(142, 68, 173);
    doc.rect(15, yPosition, 180, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`PRECO ALVO: R$ ${data.targetPrice.toFixed(2)}`, 20, yPosition + 9);
    doc.setTextColor(0, 0, 0);
    yPosition += 20;
  }
  
  // Professional footer
  const footerY = 280;
  doc.setFillColor(52, 73, 94);
  doc.rect(0, footerY, 210, 17, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Simulador de Precificacao ST - Filial MG', 20, footerY + 6);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`, 20, footerY + 12);
  doc.text(`Pagina ${doc.getCurrentPageInfo().pageNumber}`, 175, footerY + 9);

  return Buffer.from(doc.output('arraybuffer'));
};
