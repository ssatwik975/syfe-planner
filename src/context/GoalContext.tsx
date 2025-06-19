import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { goalReducer, initialState } from './goalReducer';
import type { Goal, Currency, GoalFormData, ContributionFormData, ExchangeRates } from '../types/goals';
import { fetchExchangeRates } from '../utils/api';
import { convertCurrency, calculateProgress, isValidGoal } from '../utils';

// App namespace to prevent conflicts with other apps
const APP_NAMESPACE = 'syfe-planner';

// Define the localStorage keys
const STORAGE_KEYS = {
  GOALS: `${APP_NAMESPACE}.goals`,
  RATES: `${APP_NAMESPACE}.exchange-rates`,
  VERSION: `${APP_NAMESPACE}.version`
};

// Storage version for future migrations
const STORAGE_VERSION = '1.0';

// Cache time for exchange rates (15 minutes in milliseconds)
const EXCHANGE_RATE_CACHE_TIME = 15 * 60 * 1000;

// Define the shape of our context
interface GoalContextType {
  goals: Goal[];
  exchangeRates: ExchangeRates;
  isLoading: boolean;
  error: string | null;
  addGoal: (goalData: GoalFormData) => void;
  removeGoal: (goalId: string) => void;
  updateGoalAmount: (goalId: string, amount: number) => void;
  addContribution: (contributionData: ContributionFormData) => void;
  updateExchangeRates: (forceRefresh?: boolean) => Promise<void>;
  getTotalSaved: (currency: Currency) => number;
  getTotalTarget: (currency: Currency) => number;
  getOverallProgress: () => number;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
}

// Create context with a default value
const GoalContext = createContext<GoalContextType | undefined>(undefined);

// Provider component
export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Track API fetch attempts
  const [lastFetchAttempt, setLastFetchAttempt] = useState<number>(0);
  const MIN_FETCH_INTERVAL = 5000; // 5 seconds in milliseconds
  
  // Initialize state with data from localStorage if available
  const [state, dispatch] = useReducer(goalReducer, initialState, (initialState) => {
    try {
      // Check storage version
      const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
      
      // If versions don't match, could handle data migration or just use defaults
      if (storedVersion !== STORAGE_VERSION) {
        localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
        // For now, just use default state if version mismatch
        return initialState;
      }
      
      // Load goals from localStorage
      const storedGoals = localStorage.getItem(STORAGE_KEYS.GOALS);
      let parsedGoals: Goal[] = [];
      
      if (storedGoals) {
        const parsed = JSON.parse(storedGoals);
        
        // Validate that the parsed data is an array and has proper goal structure
        if (Array.isArray(parsed) && parsed.every(isValidGoal)) {
          parsedGoals = parsed;
        } else {
          console.warn('Stored goals data is corrupted, using default state');
        }
      }

      // Load cached exchange rates
      const storedRates = localStorage.getItem(STORAGE_KEYS.RATES);
      let parsedRates = initialState.exchangeRates;
      
      if (storedRates) {
        try {
          const ratesData = JSON.parse(storedRates);
          
          // Check if the cached rates are still valid (within 15 minutes)
          const lastUpdated = new Date(ratesData.lastUpdated).getTime();
          const now = new Date().getTime();
          
          if (now - lastUpdated < EXCHANGE_RATE_CACHE_TIME) {
            parsedRates = ratesData;
          }
        } catch (error) {
          console.warn('Stored rates data is corrupted, using default rates');
        }
      }
      
      return {
        ...initialState,
        goals: parsedGoals,
        exchangeRates: parsedRates
      };
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return initialState;
    }
  });

  // Save goals to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(state.goals));
    } catch (error) {
      // Better error handling for storage quota issues
      if (error instanceof DOMException && 
          (error.name === 'QuotaExceededError' || 
           error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.error('Storage quota exceeded. Some data may not be saved.');
        // Maybe show a user notification here
      } else {
        console.error('Error saving goals to localStorage:', error);
      }
    }
  }, [state.goals]);
  
  // Save exchange rates to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(state.exchangeRates));
    } catch (error) {
      if (error instanceof DOMException && 
          (error.name === 'QuotaExceededError' || 
           error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.error('Storage quota exceeded. Exchange rates may not be saved.');
      } else {
        console.error('Error saving exchange rates to localStorage:', error);
      }
    }
  }, [state.exchangeRates]);

  // Listen for storage events (when localStorage is updated in another tab)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.GOALS && event.newValue) {
        try {
          // Update our local state with the data from the other tab
          const updatedGoals = JSON.parse(event.newValue);
          if (Array.isArray(updatedGoals) && updatedGoals.every(isValidGoal)) {
            dispatch({ 
              type: 'SET_GOALS', 
              payload: updatedGoals 
            });
          }
        } catch (e) {
          console.error('Error parsing goals from storage event:', e);
        }
      } else if (event.key === STORAGE_KEYS.RATES && event.newValue) {
        try {
          const updatedRates = JSON.parse(event.newValue);
          dispatch({ 
            type: 'FETCH_RATES_SUCCESS', 
            payload: updatedRates 
          });
        } catch (e) {
          console.error('Error parsing rates from storage event:', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch exchange rates when the app loads and every 5 minutes
  useEffect(() => {
    // Always fetch fresh rates on initial load
    updateExchangeRates(true);
    
    // Set up interval to refresh rates every 5 minutes (300000 ms)
    const refreshInterval = setInterval(() => {
      updateExchangeRates();
    }, 300000); // 5 minutes in milliseconds
    
    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Add a new goal
  const addGoal = (goalData: GoalFormData) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      ...goalData,
      savedAmount: 0,
      contributions: [],
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    
    // Update localStorage for cross-tab sync
    const updatedGoals = [...state.goals, newGoal];
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updatedGoals));
  };

  // Remove a goal
  const removeGoal = (goalId: string) => {
    dispatch({
      type: 'REMOVE_GOAL',
      payload: { goalId }
    });
  };

  // Update goal amount
  const updateGoalAmount = (goalId: string, amount: number) => {
    dispatch({
      type: 'UPDATE_GOAL_AMOUNT',
      payload: { goalId, amount }
    });
  };

  // Add a contribution to a goal
  const addContribution = (contributionData: ContributionFormData) => {
    dispatch({
      type: 'ADD_CONTRIBUTION',
      payload: {
        ...contributionData,
        id: crypto.randomUUID(),
        date: contributionData.date || new Date().toISOString() // Use provided date or current date
      }
    });
  };

  // Update exchange rates
  const updateExchangeRates = async (forceRefresh = false) => {
    const now = new Date().getTime();
    
    // Check if we've fetched recently to prevent API abuse
    if (!forceRefresh && now - lastFetchAttempt < MIN_FETCH_INTERVAL) {
      console.log('Rate fetch throttled. Please wait before trying again.');
      return;
    }
    
    setLastFetchAttempt(now);
    dispatch({ type: 'FETCH_RATES_START' });
    
    try {
      const rates = await fetchExchangeRates();
      dispatch({ type: 'FETCH_RATES_SUCCESS', payload: rates });
      
      // Update localStorage for cross-tab sync
      localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(rates));
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
      return total + convertCurrency(goal.savedAmount, goal.currency, currency, state.exchangeRates);
    }, 0);
  };

  // Calculate total target amount in specified currency
  const getTotalTarget = (currency: Currency): number => {
    return state.goals.reduce((total, goal) => {
      return total + convertCurrency(goal.amount, goal.currency, currency, state.exchangeRates);
    }, 0);
  };

  // Calculate overall progress percentage across all goals
  const getOverallProgress = (): number => {
    const totalTarget = getTotalTarget('USD');
    if (totalTarget === 0) return 0;
    
    const totalSaved = getTotalSaved('USD');
    return calculateProgress(totalSaved, totalTarget);
  };

  // Add export/import functions for data backup
  const exportData = (): string => {
    return JSON.stringify({
      goals: state.goals,
      rates: state.exchangeRates,
      timestamp: new Date().toISOString(),
      version: STORAGE_VERSION
    });
  };
  
  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // Validate imported data
      if (!data.goals || !Array.isArray(data.goals) || !data.goals.every(isValidGoal)) {
        throw new Error('Invalid goal data');
      }
      
      // Import the goals
      dispatch({
        type: 'SET_GOALS',
        payload: data.goals
      });
      
      // Import the rates if available
      if (data.rates) {
        dispatch({
          type: 'FETCH_RATES_SUCCESS',
          payload: data.rates
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  return (
    <GoalContext.Provider value={{
      goals: state.goals,
      exchangeRates: state.exchangeRates,
      isLoading: state.isLoading,
      error: state.error,
      addGoal,
      removeGoal,
      updateGoalAmount,
      addContribution,
      updateExchangeRates,
      getTotalSaved,
      getTotalTarget,
      getOverallProgress,
      exportData,
      importData
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