import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Percent } from "lucide-react";
import { SalesData, PAYMENT_CONDITIONS } from "@/types/simulator";

interface SalesTaxesCardProps {
  data: SalesData;
  onUpdate: (field: keyof SalesData, value: number) => void;
}

export const SalesTaxesCard = ({ data, onUpdate }: SalesTaxesCardProps) => {
  const handleInputChange = (field: keyof SalesData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(',', '.')) || 0;
    onUpdate(field, value);
  };

  const handlePaymentConditionChange = (value: string) => {
    onUpdate('paymentCondition', parseFloat(value));
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          Impostos e Margens de Venda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="icmsSale" className="text-sm font-medium text-gray-700">
              ICMS Venda (%)
            </Label>
            <Input
              id="icmsSale"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={data.icmsSale || ''}
              onChange={handleInputChange('icmsSale')}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="piscofinsSale" className="text-sm font-medium text-gray-700">
              PIS/COFINS Venda (%)
            </Label>
            <Input
              id="piscofinsSale"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={data.piscofinsSale || ''}
              onChange={handleInputChange('piscofinsSale')}
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="devolution" className="text-sm font-medium text-gray-700">
              Devolução (%)
            </Label>
            <Input
              id="devolution"
              type="number"
              step="0.01"
              value={data.devolution}
              onChange={handleInputChange('devolution')}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="grossMargin" className="text-sm font-medium text-gray-700">
              Margem Bruta (%)
            </Label>
            <Input
              id="grossMargin"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={data.grossMargin || ''}
              onChange={handleInputChange('grossMargin')}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="flex" className="text-sm font-medium text-gray-700">
              Flex (%)
            </Label>
            <Input
              id="flex"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={data.flex || ''}
              onChange={handleInputChange('flex')}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="mva" className="text-sm font-medium text-gray-700">
            MVA (%)
          </Label>
          <Input
            id="mva"
            type="number"
            step="0.01"
            value={data.mva}
            onChange={handleInputChange('mva')}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700">
            Condição de Pagamento
          </Label>
          <Select 
            value={data.paymentCondition.toString()} 
            onValueChange={handlePaymentConditionChange}
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_CONDITIONS.map((condition) => (
                <SelectItem key={condition.value} value={condition.value.toString()}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
