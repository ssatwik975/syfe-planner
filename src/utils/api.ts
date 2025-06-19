import type { ExchangeRates } from '../types/goals';

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;

// Fallback rates if API fails
const FALLBACK_RATES: ExchangeRates = {
  USD_INR: 82.49,
  INR_USD: 1 / 82.49,
  lastUpdated: new Date().toISOString()
};

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    // Validate API key
    if (!API_KEY) {
      console.error('API key is missing. Please check your .env.local file');
      return FALLBACK_RATES;
    }
    
    // Fetch fresh rates
    console.log('Fetching fresh exchange rates from API');
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/USD/INR`);
    
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`);
      return FALLBACK_RATES;
    }
    
    const data = await response.json();
    
    if (data && data.conversion_rate) {
      console.log('Successfully fetched new rates:', data.conversion_rate);
      
      return {
        USD_INR: data.conversion_rate,
        INR_USD: 1 / data.conversion_rate,
        lastUpdated: new Date().toISOString()
      };
    } else {
      console.error('Invalid API response:', data);
      return FALLBACK_RATES;
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return FALLBACK_RATES;
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