import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { CalculatedValues } from "@/types/simulator";

interface CMVCalculationCardProps {
  values: CalculatedValues;
  formatCurrency: (value: number) => string;
}

export const CMVCalculationCard = ({ values, formatCurrency }: CMVCalculationCardProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
            <Calculator className="w-4 h-4 text-emerald-600" />
          </div>
          Cálculo do CMV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-1">Valor do IPI (R$)</label>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(values.ipiValue)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-1">Valor ICMS Compra (R$)</label>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(values.icmsValue)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-1">Valor PIS/COFINS (R$)</label>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(values.piscofinsValue)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-1">Valor do Frete (R$)</label>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(values.freightValue)}</div>
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
          <label className="block text-sm font-medium text-blue-700 mb-2">CMV Final</label>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(values.cmvFinal)}</div>
          <p className="text-xs text-blue-600 mt-1">Custo + IPI - ICMS - PIS/COFINS + Frete</p>
          <p className="text-xs text-blue-500 mt-1 italic">* PIS/COFINS = (Custo + IPI - ICMS) × %</p>
        </div>
      </CardContent>
    </Card>
  );
};
