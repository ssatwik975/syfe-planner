import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Goal, Currency, GoalFormData, ContributionFormData, ExchangeRates } from '../types/goals';
import { goalReducer, initialState } from './goalReducer';
import { fetchExchangeRates } from '../utils/api';

// Define the shape of our context
interface GoalContextType {
  goals: Goal[];
  exchangeRates: ExchangeRates;
  isLoading: boolean;
  error: string | null;
  addGoal: (goalData: GoalFormData) => void;
  addContribution: (contributionData: ContributionFormData) => void;
  updateExchangeRates: () => Promise<void>;
  getTotalSaved: (currency: Currency) => number;
  getTotalTarget: (currency: Currency) => number;
  getOverallProgress: () => number;
}

// Create context with a default value
const GoalContext = createContext<GoalContextType | undefined>(undefined);

// Provider component
export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(goalReducer, initialState);

  // Fetch exchange rates when the app loads
  useEffect(() => {
    updateExchangeRates();
  }, []);

  // Add a new goal
  const addGoal = (goalData: GoalFormData) => {
    dispatch({
      type: 'ADD_GOAL',
      payload: {
        ...goalData,
        id: crypto.randomUUID(),
        savedAmount: 0,
        contributions: []
      }
    });
  };

  // Add a contribution to a goal
  const addContribution = (contributionData: ContributionFormData) => {
    dispatch({
      type: 'ADD_CONTRIBUTION',
      payload: {
        ...contributionData,
        id: crypto.randomUUID(),
        date: new Date().toISOString()
      }
    });
  };

  // Update exchange rates
  const updateExchangeRates = async () => {
    try {
      dispatch({ type: 'FETCH_RATES_START' });
      const rates = await fetchExchangeRates();
      dispatch({ type: 'FETCH_RATES_SUCCESS', payload: rates });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_RATES_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to fetch exchange rates' 
      });
    }
  };

  // Calculate total saved amount in specified currency
  const getTotalSaved = (currency: Currency): number => {
    return state.goals.reduce((total, goal) => {
      if (goal.currency === currency) {
        return total + goal.savedAmount;
      } else {
        // Convert from one currency to another
        const conversionRate = currency === 'USD' 
          ? state.exchangeRates.INR_USD 
          : state.exchangeRates.USD_INR;
        return total + goal.savedAmount * conversionRate;
      }
    }, 0);
  };

  // Calculate total target amount in specified currency
  const getTotalTarget = (currency: Currency): number => {
    return state.goals.reduce((total, goal) => {
      if (goal.currency === currency) {
        return total + goal.amount;
      } else {
        // Convert from one currency to another
        const conversionRate = currency === 'USD' 
          ? state.exchangeRates.INR_USD 
          : state.exchangeRates.USD_INR;
        return total + goal.amount * conversionRate;
      }
    }, 0);
  };

  // Calculate overall progress percentage across all goals
  const getOverallProgress = (): number => {
    const totalTarget = getTotalTarget('USD');
    if (totalTarget === 0) return 0;
    
    const totalSaved = getTotalSaved('USD');
    return (totalSaved / totalTarget) * 100;
  };

  return (
    <GoalContext.Provider value={{
      goals: state.goals,
      exchangeRates: state.exchangeRates,
      isLoading: state.isLoading,
      error: state.error,
      addGoal,
      addContribution,
      updateExchangeRates,
      getTotalSaved,
      getTotalTarget,
      getOverallProgress
    }}>
      {children}
    </GoalContext.Provider>
  );
};

// Custom hook for using this context
export const useGoalContext = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoalContext must be used within a GoalProvider');
  }
  return context;
};