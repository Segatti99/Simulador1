// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/services/exportService.ts
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
var createExcelExport = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Simula\xE7\xE3o ST");
  worksheet.addRow(["SIMULADOR DE PRECIFICA\xC7\xC3O COM SUBSTITUI\xC7\xC3O TRIBUT\xC1RIA"]);
  worksheet.addRow(["Filial MG - Opera\xE7\xF5es de Atacado"]);
  worksheet.addRow([]);
  worksheet.addRow(["SIMULA\xC7\xC3O:", data.simulationName]);
  worksheet.addRow(["Data de Exporta\xE7\xE3o:", new Date(data.exportDate).toLocaleDateString("pt-BR")]);
  worksheet.addRow([]);
  worksheet.addRow(["DADOS DE COMPRA"]);
  worksheet.addRow(["Custo de Compra (R$):", data.purchaseData.costoPurchase]);
  worksheet.addRow(["IPI Compra (%):", data.purchaseData.ipiPurchase]);
  worksheet.addRow(["ICMS Compra (%):", data.purchaseData.icmsPurchase]);
  worksheet.addRow(["PIS/COFINS Compra (%):", data.purchaseData.piscofinsPurchase]);
  worksheet.addRow(["Frete (%):", data.purchaseData.freight]);
  worksheet.addRow([]);
  worksheet.addRow(["C\xC1LCULO DO CMV"]);
  worksheet.addRow(["Valor do IPI (R$):", data.calculatedValues.ipiValue]);
  worksheet.addRow(["Valor ICMS Compra (R$):", data.calculatedValues.icmsValue]);
  worksheet.addRow(["Valor PIS/COFINS (R$):", data.calculatedValues.piscofinsValue]);
  worksheet.addRow(["Valor do Frete (R$):", data.calculatedValues.freightValue]);
  worksheet.addRow(["CMV Final (R$):", data.calculatedValues.cmvFinal]);
  worksheet.addRow([]);
  worksheet.addRow(["IMPOSTOS E MARGENS DE VENDA"]);
  worksheet.addRow(["ICMS Venda (%):", data.salesData.icmsSale]);
  worksheet.addRow(["PIS/COFINS Venda (%):", data.salesData.piscofinsSale]);
  worksheet.addRow(["Devolu\xE7\xE3o (%):", data.salesData.devolution]);
  worksheet.addRow(["Margem Bruta (%):", data.salesData.grossMargin]);
  worksheet.addRow(["Flex (%):", data.salesData.flex]);
  worksheet.addRow(["MVA (%):", data.salesData.mva]);
  worksheet.addRow(["Fator Condi\xE7\xE3o de Pagamento:", data.salesData.paymentCondition]);
  worksheet.addRow([]);
  worksheet.addRow(["RESULTADOS DA PRECIFICA\xC7\xC3O"]);
  worksheet.addRow(["Pre\xE7o sem ST (R$):", data.calculatedValues.priceWithoutST]);
  worksheet.addRow(["Base ST (R$):", data.calculatedValues.baseST]);
  worksheet.addRow(["ST D\xE9bito (R$):", data.calculatedValues.stDebit]);
  worksheet.addRow(["ST Cr\xE9dito (R$):", data.calculatedValues.stCredit]);
  worksheet.addRow(["Valor ST (R$):", data.calculatedValues.stValue]);
  worksheet.addRow(["Pre\xE7o com ST (R$):", data.calculatedValues.priceWithST]);
  worksheet.addRow(["Pre\xE7o com ST - FLEX (R$):", data.calculatedValues.priceWithSTFlex]);
  worksheet.addRow(["Markup (%):", data.calculatedValues.markup]);
  worksheet.addRow([]);
  if (data.targetPrice > 0) {
    worksheet.addRow(["SIMULA\xC7\xC3O REVERSA"]);
    worksheet.addRow(["Pre\xE7o Alvo (R$):", data.targetPrice]);
    worksheet.addRow(["Custo de Compra Ideal (R$):", data.reverseCalculation.idealCost]);
    worksheet.addRow(["Margem Bruta Ideal (%):", data.reverseCalculation.idealMargin]);
    worksheet.addRow(["Markup do Pre\xE7o Alvo (%):", data.reverseCalculation.targetMarkup]);
  }
  worksheet.getColumn(1).width = 35;
  worksheet.getColumn(2).width = 25;
  const titleRow = worksheet.getRow(1);
  titleRow.font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
  titleRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2980B9" } };
  titleRow.alignment = { horizontal: "center" };
  worksheet.mergeCells("A1:B1");
  const subtitleRow = worksheet.getRow(2);
  subtitleRow.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
  subtitleRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3498DB" } };
  subtitleRow.alignment = { horizontal: "center" };
  worksheet.mergeCells("A2:B2");
  const simNameRow = worksheet.getRow(4);
  simNameRow.font = { bold: true, size: 14, color: { argb: "FF000000" } };
  simNameRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFC107" } };
  worksheet.mergeCells("A4:B4");
  const sectionHeaders = [6, 13, 20, 27];
  sectionHeaders.forEach((rowNumber) => {
    const row = worksheet.getRow(rowNumber);
    row.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
    row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF34495E" } };
    worksheet.mergeCells(`A${rowNumber}:B${rowNumber}`);
  });
  for (let i = 7; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    if (!sectionHeaders.includes(i) && i !== 1 && i !== 2 && i !== 4) {
      row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F9FA" } };
      if (row.getCell(1).value) {
        row.getCell(1).font = { bold: false };
        row.getCell(2).font = { bold: true };
      }
    }
  }
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFCCCCCC" } },
        left: { style: "thin", color: { argb: "FFCCCCCC" } },
        bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
        right: { style: "thin", color: { argb: "FFCCCCCC" } }
      };
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
};
var createPDFExport = (data) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, 210, 50, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("SIMULADOR DE PRECIFICACAO", 105, 20, { align: "center" });
  doc.text("COM SUBSTITUICAO TRIBUTARIA", 105, 30, { align: "center" });
  doc.setFontSize(12);
  doc.text("Filial MG - Operacoes de Atacado", 105, 40, { align: "center" });
  doc.setFillColor(255, 193, 7);
  doc.rect(0, 50, 210, 20, "F");
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(data.simulationName, 105, 63, { align: "center" });
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(248, 249, 250);
  doc.setDrawColor(220, 220, 220);
  doc.rect(15, 75, 180, 15, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Data de Exportacao: ${new Date(data.exportDate).toLocaleDateString("pt-BR")}`, 20, 83);
  doc.text(`Gerado as: ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}`, 140, 83);
  let yPosition = 100;
  const drawTable = (title, data2, startY, highlight) => {
    doc.setFillColor(52, 73, 94);
    doc.rect(15, startY, 180, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 20, startY + 8);
    let currentY = startY + 18;
    doc.setFillColor(236, 240, 241);
    doc.setTextColor(0, 0, 0);
    doc.rect(15, currentY, 180, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ITEM", 20, currentY + 5);
    doc.text("VALOR", 140, currentY + 5);
    currentY += 8;
    data2.forEach((row, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(249, 249, 249);
        doc.rect(15, currentY, 180, 8, "F");
      }
      doc.setDrawColor(200, 200, 200);
      doc.rect(15, currentY, 180, 8, "D");
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(row.label, 20, currentY + 5);
      doc.setFont("helvetica", "bold");
      doc.text(row.value, 140, currentY + 5);
      currentY += 8;
    });
    return currentY + 10;
  };
  const purchaseData = [
    { label: "Custo de Compra", value: `R$ ${data.purchaseData.costoPurchase.toFixed(2)}` },
    { label: "IPI Compra", value: `${data.purchaseData.ipiPurchase.toFixed(2)}%` },
    { label: "ICMS Compra", value: `${data.purchaseData.icmsPurchase.toFixed(2)}%` },
    { label: "PIS/COFINS Compra", value: `${data.purchaseData.piscofinsPurchase.toFixed(2)}%` },
    { label: "Frete", value: `${data.purchaseData.freight.toFixed(2)}%` }
  ];
  yPosition = drawTable("DADOS DE COMPRA", purchaseData, yPosition);
  const cmvData = [
    { label: "Valor do IPI", value: `R$ ${data.calculatedValues.ipiValue.toFixed(2)}` },
    { label: "Valor ICMS Compra", value: `R$ ${data.calculatedValues.icmsValue.toFixed(2)}` },
    { label: "Valor PIS/COFINS", value: `R$ ${data.calculatedValues.piscofinsValue.toFixed(2)}` },
    { label: "Valor do Frete", value: `R$ ${data.calculatedValues.freightValue.toFixed(2)}` }
  ];
  yPosition = drawTable("CALCULO DO CMV", cmvData, yPosition);
  doc.setFillColor(231, 76, 60);
  doc.rect(15, yPosition - 5, 180, 15, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`CMV FINAL: R$ ${data.calculatedValues.cmvFinal.toFixed(2)}`, 20, yPosition + 5);
  doc.setTextColor(0, 0, 0);
  yPosition += 20;
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  const salesDataArray = [
    { label: "ICMS Venda", value: `${data.salesData.icmsSale.toFixed(2)}%` },
    { label: "PIS/COFINS Venda", value: `${data.salesData.piscofinsSale.toFixed(2)}%` },
    { label: "Devolucao", value: `${data.salesData.devolution.toFixed(2)}%` },
    { label: "Margem Bruta", value: `${data.salesData.grossMargin.toFixed(2)}%` },
    { label: "Flex", value: `${data.salesData.flex.toFixed(2)}%` },
    { label: "MVA", value: `${data.salesData.mva.toFixed(2)}%` },
    { label: "Fator Condicao Pagamento", value: `${data.salesData.paymentCondition.toFixed(4)}` }
  ];
  yPosition = drawTable("IMPOSTOS E MARGENS DE VENDA", salesDataArray, yPosition);
  if (yPosition > 180) {
    doc.addPage();
    yPosition = 20;
  }
  const pricingData = [
    { label: "Preco sem ST", value: `R$ ${data.calculatedValues.priceWithoutST.toFixed(2)}` },
    { label: "Base ST", value: `R$ ${data.calculatedValues.baseST.toFixed(2)}` },
    { label: "ST Debito", value: `R$ ${data.calculatedValues.stDebit.toFixed(2)}` },
    { label: "ST Credito", value: `R$ ${data.calculatedValues.stCredit.toFixed(2)}` },
    { label: "Valor ST", value: `R$ ${data.calculatedValues.stValue.toFixed(2)}` }
  ];
  yPosition = drawTable("RESULTADOS DA PRECIFICACAO", pricingData, yPosition);
  doc.setFillColor(46, 204, 113);
  doc.rect(15, yPosition, 85, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("PRECO COM ST", 17, yPosition + 7);
  doc.setFontSize(13);
  doc.text(`R$ ${data.calculatedValues.priceWithST.toFixed(2)}`, 17, yPosition + 14);
  doc.setFillColor(52, 152, 219);
  doc.rect(110, yPosition, 85, 18, "F");
  doc.setFontSize(11);
  doc.text("PRECO FINAL (-FLEX)", 112, yPosition + 7);
  doc.setFontSize(13);
  doc.text(`R$ ${data.calculatedValues.priceWithSTFlex.toFixed(2)}`, 112, yPosition + 14);
  yPosition += 25;
  doc.setFillColor(155, 89, 182);
  doc.rect(15, yPosition, 180, 15, "F");
  doc.setFontSize(12);
  doc.text(`MARKUP: ${data.calculatedValues.markup.toFixed(2)}%`, 20, yPosition + 9);
  doc.setTextColor(0, 0, 0);
  yPosition += 25;
  if (data.targetPrice > 0) {
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 20;
    }
    const reverseData = [
      { label: "Preco Alvo", value: `R$ ${data.targetPrice.toFixed(2)}` },
      { label: "Custo de Compra Ideal", value: `R$ ${data.reverseCalculation.idealCost.toFixed(2)}` },
      { label: "Margem Bruta Ideal", value: `${data.reverseCalculation.idealMargin.toFixed(2)}%` },
      { label: "Markup do Preco Alvo", value: `${data.reverseCalculation.targetMarkup.toFixed(2)}%` }
    ];
    yPosition = drawTable("SIMULACAO REVERSA", reverseData, yPosition);
    doc.setFillColor(142, 68, 173);
    doc.rect(15, yPosition, 180, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`PRECO ALVO: R$ ${data.targetPrice.toFixed(2)}`, 20, yPosition + 9);
    doc.setTextColor(0, 0, 0);
    yPosition += 20;
  }
  const footerY = 280;
  doc.setFillColor(52, 73, 94);
  doc.rect(0, footerY, 210, 17, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Simulador de Precificacao ST - Filial MG", 20, footerY + 6);
  doc.text(`Gerado em ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")} as ${(/* @__PURE__ */ new Date()).toLocaleTimeString("pt-BR")}`, 20, footerY + 12);
  doc.text(`Pagina ${doc.getCurrentPageInfo().pageNumber}`, 175, footerY + 9);
  return Buffer.from(doc.output("arraybuffer"));
};

// server/routes.ts
async function registerRoutes(app2) {
  app2.post("/api/export/pdf", async (req, res) => {
    try {
      const exportData = req.body;
      const pdfBuffer = createPDFExport(exportData);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=simulacao-st.pdf");
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  });
  app2.post("/api/export/excel", async (req, res) => {
    try {
      const exportData = req.body;
      const excelBuffer = await createExcelExport(exportData);
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=simulacao-st.xlsx");
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error generating Excel:", error);
      res.status(500).json({ error: "Failed to generate Excel" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({ limit: "50mb" }));
app.use(express2.urlencoded({ extended: true, limit: "50mb" }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
