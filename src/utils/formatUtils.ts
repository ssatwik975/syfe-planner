import type { Currency } from '../types/goals';

/**
 * Formats a date string to a readable format
 */
export function formatDate(
  dateString: string, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
): string {
  return new Date(dateString).toLocaleString('en-US', options);
}

/**
 * Formats a currency amount with appropriate symbol and formatting
 */
export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}