import type { Goal } from '../types/goals';

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates amount input for goals and contributions
 */
export function validateAmount(
  amount: string, 
  min: number = 0, 
  max: number | null = null
): ValidationResult {
  const parsedAmount = parseFloat(amount);
  
  if (!amount || isNaN(parsedAmount)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }
  
  if (parsedAmount <= min) {
    return { isValid: false, error: `Amount must be greater than ${min}` };
  }
  
  if (max !== null && parsedAmount > max) {
    return { isValid: false, error: `Amount cannot exceed ${max}` };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validates date input for contributions
 */
export function validateDate(dateString: string): ValidationResult {
  const selectedDate = new Date(dateString);
  const today = new Date();
  
  if (isNaN(selectedDate.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }
  
  if (selectedDate > today) {
    return { isValid: false, error: 'Date cannot be in the future' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Validation function for goals
 */
export function isValidGoal(goal: any): goal is Goal {
  return (
    typeof goal === 'object' && goal !== null &&
    typeof goal.id === 'string' &&
    typeof goal.title === 'string' &&
    typeof goal.amount === 'number' &&
    typeof goal.savedAmount === 'number' &&
    (goal.currency === 'USD' || goal.currency === 'INR') &&
    Array.isArray(goal.contributions) &&
    (typeof goal.createdAt === 'string' || goal.createdAt === undefined)
  );
}