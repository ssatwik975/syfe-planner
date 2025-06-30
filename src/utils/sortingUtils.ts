import type { Contribution, Goal } from '../types/goals';

/**
 * Sorts goals by creation date (newest first)
 */
export function sortGoalsByDate(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return b.id.localeCompare(a.id);
  });
}

/**
 * Sorts contributions by date (newest first)
 */
export function sortContributionsByDate(contributions: Contribution[]): Contribution[] {
  return [...contributions].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// export default { sortContributionsByDate, sortGoalsByDate };