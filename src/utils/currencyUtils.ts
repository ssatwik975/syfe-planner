import type { Currency, ExchangeRates } from '../types/goals';

/**
 * Converts an amount between currencies using provided exchange rates
 */
export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRates: ExchangeRates
): number {
  // If currencies are the same, no conversion needed
  if (fromCurrency === toCurrency) return amount;
  
  // Select the appropriate conversion rate
  const conversionRate = 
    fromCurrency === 'USD' && toCurrency === 'INR'
      ? exchangeRates.USD_INR
      : exchangeRates.INR_USD;
      
  return amount * conversionRate;
}

/**
 * Gets the appropriate conversion rate between two currencies
 */
export function getConversionRate(
  fromCurrency: Currency,
  toCurrency: Currency,
  exchangeRates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) return 1;
  
  return fromCurrency === 'USD' && toCurrency === 'INR'
    ? exchangeRates.USD_INR
    : exchangeRates.INR_USD;
}