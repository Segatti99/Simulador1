import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createExcelExport, createPDFExport } from "./services/exportService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Export routes
  app.post("/api/export/pdf", async (req, res) => {
    try {
      const exportData = req.body;
      const pdfBuffer = createPDFExport(exportData);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=simulacao-st.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });

  app.post("/api/export/excel", async (req, res) => {
    try {
      const exportData = req.body;
      const excelBuffer = await createExcelExport(exportData);
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=simulacao-st.xlsx');
      res.send(excelBuffer);
    } catch (error) {
      console.error('Error generating Excel:', error);
      res.status(500).json({ error: 'Failed to generate Excel' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
