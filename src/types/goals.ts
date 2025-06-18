export type Currency = 'USD' | 'INR';

export interface Contribution {
  id: string;
  amount: number;
  date: string; // ISO date string
  note?: string;
}

export interface Goal {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  savedAmount: number;
  contributions: Contribution[];
}

export interface GoalFormData {
  title: string;
  amount: number;
  currency: Currency;
}

export interface ContributionFormData {
  goalId: string;
  amount: number;
  note?: string;
}

export interface FormErrors {
  title?: string;
  amount?: string;
}

export interface ExchangeRates {
  USD_INR: number;
  INR_USD: number;
  lastUpdated: string;
}