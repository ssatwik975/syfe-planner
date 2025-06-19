/**
 * Calculates progress percentage based on saved amount and target amount
 */
export function calculateProgress(savedAmount: number, targetAmount: number): number {
  if (targetAmount <= 0) return 0;
  return Math.min(100, (savedAmount / targetAmount) * 100);
}

/**
 * Calculates remaining amount to save
 */
export function calculateRemainingAmount(targetAmount: number, savedAmount: number): number {
  return Math.max(0, targetAmount - savedAmount);
}

/**
 * Checks if a goal is completed
 */
export function isGoalComplete(savedAmount: number, targetAmount: number): boolean {
  return savedAmount >= targetAmount;
}