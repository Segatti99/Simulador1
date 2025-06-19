import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingCart } from "lucide-react";
import { PurchaseData } from "@/types/simulator";

interface PurchaseDataCardProps {
  data: PurchaseData;
  onUpdate: (field: keyof PurchaseData, value: number) => void;
}

export const PurchaseDataCard = ({ data, onUpdate }: PurchaseDataCardProps) => {
  const handleInputChange = (field: keyof PurchaseData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(',', '.')) || 0;
    onUpdate(field, value);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </div>
          Dados de Compra
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="costoPurchase" className="text-sm font-medium text-gray-700">
            Custo de Compra (R$)
          </Label>
          <Input
            id="costoPurchase"
            type="number"
            step="0.01"
            placeholder="0,00"
            value={data.costoPurchase || ''}
            onChange={handleInputChange('costoPurchase')}
            className="mt-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ipiPurchase" className="text-sm font-medium text-gray-700">
              IPI Compra (%)
            </Label>
            <Input
              id="ipiPurchase"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={data.ipiPurchase || ''}
              onChange={handleInputChange('ipiPurchase')}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="icmsPurchase" className="text-sm font-medium text-gray-700">
              ICMS Compra (%)
            </Label>
            <Input
              id="icmsPurchase"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={data.icmsPurchase || ''}
              onChange={handleInputChange('icmsPurchase')}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="piscofinsPurchase" className="text-sm font-medium text-gray-700">
              PIS/COFINS Compra (%)
            </Label>
            <Input
              id="piscofinsPurchase"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={data.piscofinsPurchase || ''}
              onChange={handleInputChange('piscofinsPurchase')}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="freight" className="text-sm font-medium text-gray-700">
              Frete (%)
            </Label>
            <Input
              id="freight"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={data.freight || ''}
              onChange={handleInputChange('freight')}
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
