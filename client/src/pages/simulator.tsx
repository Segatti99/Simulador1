import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Calculator, ArrowRight, Target, Edit } from "lucide-react";
import { useSimulatorCalculations } from "@/hooks/useSimulatorCalculations";
import { PurchaseDataCard } from "@/components/simulator/PurchaseDataCard";
import { CMVCalculationCard } from "@/components/simulator/CMVCalculationCard";
import { SalesTaxesCard } from "@/components/simulator/SalesTaxesCard";
import { PricingResultsCard } from "@/components/simulator/PricingResultsCard";
import { ReverseSimulatorCard } from "@/components/simulator/ReverseSimulatorCard";
import { ExportModal } from "@/components/simulator/ExportModal";

export default function Simulator() {
  const [activeTab, setActiveTab] = useState<'direct' | 'reverse'>('direct');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const {
    simulationName,
    setSimulationName,
    purchaseData,
    salesData,
    targetPrice,
    calculatedValues,
    reverseCalculation,
    updatePurchaseData,
    updateSalesData,
    setTargetPrice,
    formatCurrency,
    formatPercentage,
  } = useSimulatorCalculations();

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Calculator className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Simulador de Precificação ST</h1>
                  <p className="text-sm text-gray-600">Filial MG - Operações de Atacado</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-8">
                <Edit className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Nome da Simulação"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                  className="w-64 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setIsExportModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Simulação
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('direct')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'direct'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ArrowRight className="w-4 h-4 inline mr-2" />
              Simulação Direta
            </button>
            <button
              onClick={() => setActiveTab('reverse')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reverse'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Simulação Reversa
            </button>
          </nav>
        </div>

        {/* Direct Simulation Tab */}
        {activeTab === 'direct' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <PurchaseDataCard data={purchaseData} onUpdate={updatePurchaseData} />
            <CMVCalculationCard values={calculatedValues} formatCurrency={formatCurrency} />
            <SalesTaxesCard data={salesData} onUpdate={updateSalesData} />
            <PricingResultsCard 
              values={calculatedValues} 
              formatCurrency={formatCurrency} 
              formatPercentage={formatPercentage} 
            />
          </div>
        )}

        {/* Reverse Simulation Tab */}
        {activeTab === 'reverse' && (
          <ReverseSimulatorCard
            targetPrice={targetPrice}
            reverseCalculation={reverseCalculation}
            onTargetPriceChange={setTargetPrice}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
          />
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        simulationName={simulationName}
        purchaseData={purchaseData}
        salesData={salesData}
        calculatedValues={calculatedValues}
        reverseCalculation={reverseCalculation}
        targetPrice={targetPrice}
      />
    </div>
  );
}
