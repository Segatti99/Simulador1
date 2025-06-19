import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, BarChart3, Info } from "lucide-react";
import { ReverseCalculation } from "@/types/simulator";

interface ReverseSimulatorCardProps {
  targetPrice: number;
  reverseCalculation: ReverseCalculation;
  onTargetPriceChange: (value: number) => void;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

export const ReverseSimulatorCard = ({ 
  targetPrice, 
  reverseCalculation, 
  onTargetPriceChange, 
  formatCurrency, 
  formatPercentage 
}: ReverseSimulatorCardProps) => {
  const handleTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(',', '.')) || 0;
    onTargetPriceChange(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Target Price Input */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Target className="w-4 h-4 text-red-600" />
            </div>
            Simulador Reverso
            <span className="ml-2 text-sm text-gray-500 font-normal">Partindo de Preço Alvo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <Label htmlFor="targetPrice" className="text-sm font-medium text-yellow-800">
              Preço Alvo (R$)
            </Label>
            <Input
              id="targetPrice"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={targetPrice || ''}
              onChange={handleTargetPriceChange}
              className="mt-2 border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500 bg-white"
            />
            <div className="flex items-start mt-2 text-xs text-yellow-700">
              <Info className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
              <p>Valor final desejado (já considerando ST e desconto Flex)</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Parâmetros utilizados da simulação direta:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• IPI, ICMS, PIS/COFINS, Frete</div>
              <div>• Condição de pagamento</div>
              <div>• MVA e outras configurações</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reverse Results */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
            </div>
            Resultados Reversos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg text-center">
              <div className="text-sm font-medium text-indigo-700 mb-1">Custo de Compra Ideal</div>
              <div className="text-xl font-bold text-indigo-900">{formatCurrency(reverseCalculation.idealCost)}</div>
              <div className="text-xs text-indigo-600 mt-1">Para atingir o preço alvo</div>
            </div>
            
            <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg text-center">
              <div className="text-sm font-medium text-teal-700 mb-1">Margem Bruta Ideal</div>
              <div className="text-xl font-bold text-teal-900">{formatPercentage(reverseCalculation.idealMargin)}</div>
            </div>
            
            <div className="bg-pink-50 border border-pink-200 p-4 rounded-lg text-center">
              <div className="text-sm font-medium text-pink-700 mb-1">Markup do Preço Alvo</div>
              <div className="text-xl font-bold text-pink-900">{formatPercentage(reverseCalculation.targetMarkup)}</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Fórmula da Margem Bruta Ideal</h4>
            <div className="text-xs text-gray-600 font-mono bg-white p-3 rounded border break-words">
              Margem Bruta Ideal = 1 - [CMV Final ÷ (Preço Alvo ÷ Fator Condição ÷ (1 - Flex)) ÷ (1 - ICMS Venda - (1 - ICMS Venda) × PIS/COFINS Venda - Devolução)]
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
