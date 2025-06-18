import { useState } from 'react';
import type { Goal, GoalFormData } from '../types/goals';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  
  const existingGoalNames = goals.map(goal => goal.title);
  
  const addGoal = (goalData: GoalFormData) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      ...goalData,
      savedAmount: 0
    };
    
    setGoals(prevGoals => [...prevGoals, newGoal]);
  };

  return {
    goals,
    existingGoalNames,
    addGoal
  };
};