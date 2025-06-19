import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { CalculatedValues } from "@/types/simulator";

interface PricingResultsCardProps {
  values: CalculatedValues;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
}

export const PricingResultsCard = ({ values, formatCurrency, formatPercentage }: PricingResultsCardProps) => {
  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          Resultados da Precificação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
            <div className="text-sm font-medium text-blue-700 mb-1">Preço sem ST</div>
            <div className="text-xl font-bold text-blue-900">{formatCurrency(values.priceWithoutST)}</div>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
            <div className="text-sm font-medium text-green-700 mb-1">Preço com ST</div>
            <div className="text-xl font-bold text-green-900">{formatCurrency(values.priceWithST)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg text-center">
            <div className="text-sm font-medium text-emerald-700 mb-1">Preço com ST - FLEX</div>
            <div className="text-xl font-bold text-emerald-900">{formatCurrency(values.priceWithSTFlex)}</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
            <div className="text-sm font-medium text-purple-700 mb-1">Markup</div>
            <div className="text-xl font-bold text-purple-900">{formatPercentage(values.markup)}</div>
          </div>
        </div>

        {/* Intermediate Calculations */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Cálculos Intermediários</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base ST:</span>
              <span className="font-medium">{formatCurrency(values.baseST)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ST Débito:</span>
              <span className="font-medium">{formatCurrency(values.stDebit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ST Crédito:</span>
              <span className="font-medium">{formatCurrency(values.stCredit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Valor ST:</span>
              <span className="font-medium">{formatCurrency(values.stValue)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
