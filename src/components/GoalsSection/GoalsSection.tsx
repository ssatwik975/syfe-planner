import { useState } from 'react';
import AddGoal from '../AddGoal/AddGoal';
import GoalsGrid from '../GoalsGrid/GoalsGrid';
import { useGoalContext } from '../../context/GoalContext';
import { isGoalComplete } from '../../utils/calculationUtils';
import styles from './GoalsSection.module.css';

const GoalsSection = () => {
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false); // added the state here
  const { goals, addGoal } = useGoalContext();
  
  // Get existing goal names for validation
  const existingGoalNames = goals.map(goal => goal.title);

  // Filter goals based on completion status
  const filteredGoals = showCompleted 
    ? goals.filter(goal => isGoalComplete(goal.savedAmount, goal.amount))
    : goals;

  const handleOpenAddGoal = () => {
    setIsAddGoalOpen(true);
  };

  return (
    <section className={styles.goalsSection}>
      <div className={styles.goalsHeader}>
        <h2 className={styles.goalsTitle}>Your Goals</h2>
        <button 
          className={`${styles.addGoalButton} ${showCompleted ? styles.active : ''}`}
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? 'Show All Goals' : 'Show Completed Only'}
        </button>
        <button 
          className={styles.addGoalButton}
          onClick={handleOpenAddGoal}
        >
          <span className={styles.plusIcon}>+</span>
          Add Goal
        </button>
      </div>
      
      <GoalsGrid 
        goals={filteredGoals} // Use filtered goals here
        onAddGoal={handleOpenAddGoal}
      />

      <AddGoal 
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onSubmit={addGoal}
        existingGoalNames={existingGoalNames}
      />
    </section>
  );
};

export default GoalsSection;