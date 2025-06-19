export interface PurchaseData {
  costoPurchase: number;
  ipiPurchase: number;
  icmsPurchase: number;
  piscofinsPurchase: number;
  freight: number;
}

export interface SalesData {
  icmsSale: number;
  piscofinsSale: number;
  devolution: number;
  grossMargin: number;
  flex: number;
  mva: number;
  paymentCondition: number;
}

export interface CalculatedValues {
  ipiValue: number;
  icmsValue: number;
  piscofinsValue: number;
  freightValue: number;
  cmvFinal: number;
  priceWithoutST: number;
  baseST: number;
  stDebit: number;
  stCredit: number;
  stValue: number;
  priceWithST: number;
  priceWithSTFlex: number;
  markup: number;
}

export interface ReverseCalculation {
  targetPrice: number;
  idealCost: number;
  idealMargin: number;
  targetMarkup: number;
}

export interface PaymentCondition {
  label: string;
  value: number;
}

export const PAYMENT_CONDITIONS: PaymentCondition[] = [
  { label: "À Vista (1,0053)", value: 1.0053 },
  { label: "7 Dias (1,0057)", value: 1.0057 },
  { label: "14 Dias (1,0115)", value: 1.0115 },
  { label: "21 Dias (1,0173)", value: 1.0173 },
  { label: "30 Dias (1,0250)", value: 1.0250 },
  { label: "45 Dias - Martcon (1,0264)", value: 1.0264 },
  { label: "60 Dias (1,0496)", value: 1.0496 },
  { label: "30/60 Dias (1,0534)", value: 1.0534 },
  { label: "20/40/60 Dias - Martcon (1,0234)", value: 1.0234 },
  { label: "30/60/90 Dias - Martcon (1,0353)", value: 1.0353 },
  { label: "14/21/28 Dias (1,0174)", value: 1.0174 },
  { label: "20/40 Dias - Martcon (1,0251)", value: 1.0251 },
];
