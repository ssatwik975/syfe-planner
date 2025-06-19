import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Currency, Goal } from '../types/goals';

interface ModalContextType {
  // Existing contribution modal states
  isContributionModalOpen: boolean;
  currentGoalId: string | null;
  currentGoalName: string | null;
  currentGoalCurrency: Currency | null;
  maxAmount: number | null;
  openContributionModal: (goalId: string, goalName: string, currency: Currency, maxAmount: number) => void;
  closeContributionModal: () => void;
  
  // New detailed goal modal states
  isDetailedGoalModalOpen: boolean;
  currentDetailedGoal: Goal | null;
  openDetailedGoalModal: (goal: Goal) => void;
  closeDetailedGoalModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Existing states for contribution modal
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  const [currentGoalName, setCurrentGoalName] = useState<string | null>(null);
  const [currentGoalCurrency, setCurrentGoalCurrency] = useState<Currency | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);

  // New states for detailed goal modal
  const [isDetailedGoalModalOpen, setIsDetailedGoalModalOpen] = useState(false);
  const [currentDetailedGoal, setCurrentDetailedGoal] = useState<Goal | null>(null);

  // Existing methods for contribution modal
  const openContributionModal = (goalId: string, goalName: string, currency: Currency, maxAmount: number) => {
    setCurrentGoalId(goalId);
    setCurrentGoalName(goalName);
    setCurrentGoalCurrency(currency);
    setMaxAmount(maxAmount);
    setIsContributionModalOpen(true);
  };

  const closeContributionModal = () => {
    setIsContributionModalOpen(false);
  };

  // New methods for detailed goal modal
  const openDetailedGoalModal = (goal: Goal) => {
    setCurrentDetailedGoal(goal);
    setIsDetailedGoalModalOpen(true);
  };

  const closeDetailedGoalModal = () => {
    setIsDetailedGoalModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{
      isContributionModalOpen,
      currentGoalId,
      currentGoalName,
      currentGoalCurrency,
      maxAmount,
      openContributionModal,
      closeContributionModal,
      isDetailedGoalModalOpen,
      currentDetailedGoal,
      openDetailedGoalModal,
      closeDetailedGoalModal
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};