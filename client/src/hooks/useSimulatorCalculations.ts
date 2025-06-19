import { useState, useCallback, useMemo } from "react";
import { PurchaseData, SalesData, CalculatedValues, ReverseCalculation } from "@/types/simulator";

export const useSimulatorCalculations = () => {
  const [simulationName, setSimulationName] = useState<string>('');
  
  const [purchaseData, setPurchaseData] = useState<PurchaseData>({
    costoPurchase: 0,
    ipiPurchase: 0,
    icmsPurchase: 0,
    piscofinsPurchase: 0,
    freight: 0,
  });

  const [salesData, setSalesData] = useState<SalesData>({
    icmsSale: 0,
    piscofinsSale: 0,
    devolution: 0.5,
    grossMargin: 0,
    flex: 0,
    mva: 0,
    paymentCondition: 1.0053,
  });

  const [targetPrice, setTargetPrice] = useState<number>(0);

  const calculatedValues = useMemo<CalculatedValues>(() => {
    const { costoPurchase, ipiPurchase, icmsPurchase, piscofinsPurchase, freight } = purchaseData;
    const { icmsSale, piscofinsSale, devolution, grossMargin, flex, mva, paymentCondition } = salesData;

    // Convert percentages to decimals
    const ipiPurchaseDecimal = ipiPurchase / 100;
    const icmsPurchaseDecimal = icmsPurchase / 100;
    const piscofinsPurchaseDecimal = piscofinsPurchase / 100;
    const freightDecimal = freight / 100;
    const icmsSaleDecimal = icmsSale / 100;
    const piscofinsSaleDecimal = piscofinsSale / 100;
    const devolutionDecimal = devolution / 100;
    const grossMarginDecimal = grossMargin / 100;
    const flexDecimal = flex / 100;
    const mvaDecimal = mva / 100;

    // Calculate intermediate values
    const ipiValue = costoPurchase * ipiPurchaseDecimal;
    const icmsValue = costoPurchase * icmsPurchaseDecimal;
    const piscofinsValue = (costoPurchase + ipiValue - icmsValue) * piscofinsPurchaseDecimal;
    const freightValue = costoPurchase * freightDecimal;

    // Calculate CMV Final
    const cmvFinal = costoPurchase + ipiValue - icmsValue - piscofinsValue + freightValue;

    // Calculate Price without ST
    const denominator = (1 - icmsSaleDecimal - (1 - icmsSaleDecimal) * piscofinsSaleDecimal - devolutionDecimal) *
                       (1 - grossMarginDecimal) * (1 - flexDecimal);
    const priceWithoutST = denominator > 0 ? (cmvFinal / denominator) * paymentCondition : 0;

    // Calculate ST values
    const baseST = priceWithoutST * (1 + mvaDecimal);
    const stDebit = baseST * icmsSaleDecimal;
    const stCredit = priceWithoutST * icmsSaleDecimal;
    const stValue = stDebit - stCredit;
    const priceWithST = priceWithoutST + stValue;
    const priceWithSTFlex = priceWithST - (priceWithST * flexDecimal);
    const markup = costoPurchase > 0 ? ((priceWithSTFlex / costoPurchase) - 1) * 100 : 0;

    return {
      ipiValue,
      icmsValue,
      piscofinsValue,
      freightValue,
      cmvFinal,
      priceWithoutST,
      baseST,
      stDebit,
      stCredit,
      stValue,
      priceWithST,
      priceWithSTFlex,
      markup,
    };
  }, [purchaseData, salesData]);

  const reverseCalculation = useMemo<ReverseCalculation>(() => {
    if (targetPrice <= 0) {
      return {
        targetPrice: 0,
        idealCost: 0,
        idealMargin: 0,
        targetMarkup: 0,
      };
    }

    const { ipiPurchase, icmsPurchase, piscofinsPurchase, freight } = purchaseData;
    const { icmsSale, piscofinsSale, devolution, grossMargin, flex, mva, paymentCondition } = salesData;

    // Convert percentages to decimals
    const ipiPurchaseDecimal = ipiPurchase / 100;
    const icmsPurchaseDecimal = icmsPurchase / 100;
    const piscofinsPurchaseDecimal = piscofinsPurchase / 100;
    const freightDecimal = freight / 100;
    const icmsSaleDecimal = icmsSale / 100;
    const piscofinsSaleDecimal = piscofinsSale / 100;
    const devolutionDecimal = devolution / 100;
    const grossMarginDecimal = grossMargin / 100;
    const flexDecimal = flex / 100;
    const mvaDecimal = mva / 100;

    // Working backwards from targetPrice to find ideal cost
    // targetPrice = priceWithSTFlex
    // priceWithSTFlex = priceWithST - (priceWithST × flex)
    // priceWithSTFlex = priceWithST × (1 - flex)
    // So: priceWithST = targetPrice / (1 - flex)
    
    const priceWithST = targetPrice / (1 - flexDecimal);
    
    // priceWithST = priceWithoutST + stValue
    // stValue = stDebit - stCredit
    // stDebit = baseST × icmsSale = priceWithoutST × (1 + mva) × icmsSale
    // stCredit = priceWithoutST × icmsSale
    // stValue = priceWithoutST × icmsSale × mva
    // So: priceWithST = priceWithoutST + (priceWithoutST × icmsSale × mva)
    // priceWithST = priceWithoutST × (1 + icmsSale × mva)
    // So: priceWithoutST = priceWithST / (1 + icmsSale × mva)
    
    const priceWithoutST = priceWithST / (1 + icmsSaleDecimal * mvaDecimal);
    
    // priceWithoutST = (cmvFinal / denominator) × paymentCondition
    // denominator = (1 - icmsSale - (1 - icmsSale) × piscofinsSale - devolution) × (1 - grossMargin) × (1 - flex)
    // So: cmvFinal = priceWithoutST × denominator / paymentCondition
    
    const denominator = (1 - icmsSaleDecimal - (1 - icmsSaleDecimal) * piscofinsSaleDecimal - devolutionDecimal) *
                       (1 - grossMarginDecimal) * (1 - flexDecimal);
    
    const cmvFinal = (priceWithoutST * denominator) / paymentCondition;
    
    // Now solve for idealCost from cmvFinal
    // cmvFinal = idealCost + ipiValue - icmsValue - piscofinsValue + freightValue
    // ipiValue = idealCost × ipi
    // icmsValue = idealCost × icms
    // piscofinsValue = (idealCost + ipiValue - icmsValue) × piscofinsPurchase
    // freightValue = idealCost × freight
    
    // Let's substitute:
    // cmvFinal = idealCost + (idealCost × ipi) - (idealCost × icms) - ((idealCost + idealCost × ipi - idealCost × icms) × piscofinsPurchase) + (idealCost × freight)
    // cmvFinal = idealCost × (1 + ipi - icms - (1 + ipi - icms) × piscofinsPurchase + freight)
    // cmvFinal = idealCost × (1 + ipi - icms + freight - (1 + ipi - icms) × piscofinsPurchase)
    // cmvFinal = idealCost × ((1 + ipi - icms + freight) × (1 - piscofinsPurchase))
    
    const multiplier = (1 + ipiPurchaseDecimal - icmsPurchaseDecimal + freightDecimal) * (1 - piscofinsPurchaseDecimal);
    const idealCost = multiplier > 0 ? cmvFinal / multiplier : 0;
    
    // Calculate ideal margin using the original formula with ideal cost
    const idealCostIpiValue = idealCost * ipiPurchaseDecimal;
    const idealCostIcmsValue = idealCost * icmsPurchaseDecimal;
    const idealCostPiscofinsValue = (idealCost + idealCostIpiValue - idealCostIcmsValue) * piscofinsPurchaseDecimal;
    const idealCostFreightValue = idealCost * freightDecimal;
    const idealCostCmvFinal = idealCost + idealCostIpiValue - idealCostIcmsValue - idealCostPiscofinsValue + idealCostFreightValue;
    
    const idealDenominator = (targetPrice / paymentCondition / (1 - flexDecimal)) / 
                           (1 - icmsSaleDecimal - (1 - icmsSaleDecimal) * piscofinsSaleDecimal - devolutionDecimal);
    const idealMargin = idealDenominator > 0 ? (1 - (idealCostCmvFinal / idealDenominator)) * 100 : 0;

    const targetMarkup = idealCost > 0 ? ((targetPrice / idealCost) - 1) * 100 : 0;

    return {
      targetPrice,
      idealCost,
      idealMargin,
      targetMarkup,
    };
  }, [targetPrice, purchaseData, salesData]);

  const updatePurchaseData = useCallback((field: keyof PurchaseData, value: number) => {
    setPurchaseData(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateSalesData = useCallback((field: keyof SalesData, value: number) => {
    setSalesData(prev => ({ ...prev, [field]: value }));
  }, []);

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }, []);

  const formatPercentage = useCallback((value: number): string => {
    return `${(value || 0).toFixed(2)}%`;
  }, []);

  return {
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
  };
};
