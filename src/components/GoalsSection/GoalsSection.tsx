import { useState } from 'react';
import AddGoalForm from '../AddGoalForm/AddGoalForm';
import GoalsGrid from '../GoalsGrid/GoalsGrid';
import { useGoals } from '../../hooks/useGoals';
import styles from './GoalsSection.module.css';

const GoalsSection = () => {
  const { goals, existingGoalNames, addGoal } = useGoals();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  const handleOpenAddGoal = () => {
    setIsAddGoalOpen(true);
  };

  return (
    <section className={styles.goalsSection}>
      <div className={styles.goalsHeader}>
        <h2 className={styles.goalsTitle}>Your Goals</h2>
        <button 
          className={styles.addGoalButton}
          onClick={handleOpenAddGoal}
        >
          <span className={styles.plusIcon}>+</span>
          Add Goal
        </button>
      </div>
      
      <GoalsGrid 
        goals={goals} 
        onAddGoal={handleOpenAddGoal}
      />

      <AddGoalForm 
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onSubmit={addGoal}
        existingGoalNames={existingGoalNames}
      />
    </section>
  );
};

export default GoalsSection;