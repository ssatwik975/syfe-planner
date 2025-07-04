import type { Goal, ExchangeRates, Contribution } from '../types/goals';

// Define the shape of our state
interface GoalState {
  goals: Goal[];
  exchangeRates: ExchangeRates;
  isLoading: boolean;
  error: string | null;
}

// Define the types of actions
type GoalAction =
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'REMOVE_GOAL'; payload: { goalId: string } }
  | { type: 'UPDATE_GOAL_AMOUNT'; payload: { goalId: string; amount: number } }
  | { type: 'ADD_CONTRIBUTION'; payload: Contribution & { goalId: string } }
  | { type: 'FETCH_RATES_START' }
  | { type: 'FETCH_RATES_SUCCESS'; payload: ExchangeRates }
  | { type: 'FETCH_RATES_ERROR'; payload: string }
  | { type: 'SET_GOALS'; payload: Goal[] }; // for cross-tab sync

// Initial state
export const initialState: GoalState = {
  goals: [],
  exchangeRates: {
    USD_INR: 86.49, // Default fallback rate
    INR_USD: 1/86.49, // Default fallback rate
    lastUpdated: new Date().toISOString()
  },
  isLoading: false,
  error: null
};

// Reducer function
export const goalReducer = (state: GoalState, action: GoalAction): GoalState => {
  switch (action.type) {
    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };
    
    case 'REMOVE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload.goalId)
      };
      
    case 'UPDATE_GOAL_AMOUNT':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.goalId 
            ? { ...goal, amount: action.payload.amount } 
            : goal
        )
      };
      
    case 'ADD_CONTRIBUTION': {
      const { goalId, ...contributionData } = action.payload;
      const updatedGoals = state.goals.map(goal => {
        if (goal.id === goalId) {
          const newSavedAmount = goal.savedAmount + contributionData.amount;
          return {
            ...goal,
            savedAmount: newSavedAmount,
            contributions: [...goal.contributions, contributionData]
          };
        }
        return goal;
      });
      
      return {
        ...state,
        goals: updatedGoals
      };
    }
      
    case 'FETCH_RATES_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case 'FETCH_RATES_SUCCESS':
      return {
        ...state,
        exchangeRates: action.payload,
        isLoading: false
      };
      
    case 'FETCH_RATES_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    // New case for handling goals set from another tab
    case 'SET_GOALS':
      return {
        ...state,
        goals: action.payload
      };
      
    default:
      return state;
  }
};