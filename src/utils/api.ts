import type { ExchangeRates } from '../types/goals';

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {

    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/USD/INR`);
    const data = await response.json();
    
    if (data && data.conversion_rate) {
      return {
        USD_INR: data.conversion_rate,
        INR_USD: 1 / data.conversion_rate,
        lastUpdated: new Date().toISOString()
      };
    } else {
      throw new Error('Invalid response format from API');
    }
    
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Fallback to default rates if API fails
    return {
      USD_INR: 80,
      INR_USD: 1/80,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Utility function to format currency
export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};