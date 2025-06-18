export interface Goal {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  savedAmount: number;
}

export type Currency = 'USD' | 'INR';

export interface GoalFormData {
  title: string;
  amount: number;
  currency: Currency;
}

export interface FormErrors {
  title?: string;
  amount?: string;
}