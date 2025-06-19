import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PurchaseData, SalesData, CalculatedValues, ReverseCalculation } from "@/types/simulator";
import { apiRequest } from "@/lib/queryClient";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulationName: string;
  purchaseData: PurchaseData;
  salesData: SalesData;
  calculatedValues: CalculatedValues;
  reverseCalculation: ReverseCalculation;
  targetPrice: number;
}

export const ExportModal = ({ 
  isOpen, 
  onClose,
  simulationName,
  purchaseData, 
  salesData, 
  calculatedValues, 
  reverseCalculation,
  targetPrice 
}: ExportModalProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      const exportData = {
        simulationName: simulationName || 'Simulação ST',
        purchaseData,
        salesData,
        calculatedValues,
        reverseCalculation,
        targetPrice,
        exportDate: new Date().toISOString(),
      };

      const response = await apiRequest('POST', `/api/export/${format}`, exportData);
      const blob = await response.blob();
      
      // Create download link with simulation name
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const fileName = simulationName 
        ? `${simulationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
        : `simulacao-st-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Exportação concluída",
        description: `Arquivo ${format.toUpperCase()} baixado com sucesso.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="w-5 h-5 text-blue-600 mr-3" />
            Exportar Simulação
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          {simulationName && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Simulação:</strong> {simulationName}
              </p>
            </div>
          )}
          
          <div className="space-y-3">
            <Button
              className="w-full justify-center bg-red-600 hover:bg-red-700 text-white"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <FileText className="w-4 h-4 mr-2" />
              {isExporting ? "Gerando..." : "Exportar como PDF"}
            </Button>
            <Button
              className="w-full justify-center bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleExport('excel')}
              disabled={isExporting}
            >
              <File className="w-4 h-4 mr-2" />
              {isExporting ? "Gerando..." : "Exportar como Excel"}
            </Button>
          </div>
        </div>
        <div className="pt-4">
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
