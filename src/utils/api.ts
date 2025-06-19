import type { ExchangeRates } from '../types/goals';

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;
const RATE_CACHE_KEY = 'syfe-exchange-rates';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    // Check cache first
    const cachedRates = localStorage.getItem(RATE_CACHE_KEY);
    if (cachedRates) {
      const parsedRates: ExchangeRates = JSON.parse(cachedRates);
      const lastUpdated = new Date(parsedRates.lastUpdated).getTime();
      const now = new Date().getTime();
      
      // If cache is still valid, return it
      if (now - lastUpdated < CACHE_DURATION) {
        console.log('Using cached exchange rates');
        return parsedRates;
      }
    }
    
    // Fetch fresh rates if cache is expired or doesn't exist
    console.log('Fetching fresh exchange rates from API');
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/USD/INR`);
    const data = await response.json();
    
    if (data && data.conversion_rate) {
      const rates: ExchangeRates = {
        USD_INR: data.conversion_rate,
        INR_USD: 1 / data.conversion_rate,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to cache
      localStorage.setItem(RATE_CACHE_KEY, JSON.stringify(rates));
      
      return rates;
    } else {
      throw new Error('Invalid response format from API');
    }
    
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Try to use existing cache even if it's expired
    const cachedRates = localStorage.getItem(RATE_CACHE_KEY);
    if (cachedRates) {
      console.log('API failed, using expired cached rates');
      return JSON.parse(cachedRates);
    }
    
    // Fallback to default rates if API fails and no cache exists
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