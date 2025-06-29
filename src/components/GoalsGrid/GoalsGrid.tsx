import type { Goal } from '../../types/goals';
import GoalCard from '../GoalCard/GoalCard';
import { sortGoalsByDate } from '../../utils';
import styles from './GoalsGrid.module.css';

interface GoalsGridProps {
  goals: Goal[];
  onAddGoal: () => void;
}

const GoalsGrid = ({ goals, onAddGoal }: GoalsGridProps) => {
  // Use the utility function to sort goals
  const sortedGoals = sortGoalsByDate(goals);

  return (
    <div className={styles.container}>
      {goals.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateContent}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.emptyStateIcon}>
              <circle cx="32" cy="32" r="24" stroke="#4F67FF" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M32 20L32 44" stroke="#4F67FF" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M44 32L20 32" stroke="#4F67FF" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <h3 className={styles.emptyStateTitle}>No goals yet</h3>
            <p className={styles.emptyStateText}>Create your first financial goal to start tracking your savings progress</p>
            <button 
              className={styles.emptyStateButton}
              onClick={onAddGoal}
            >
              <span className={styles.plusIcon}>+</span>
              Add Your First Goal
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {sortedGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsGrid;