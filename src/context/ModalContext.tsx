import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Currency } from '../types/goals';

interface ModalContextType {
  isContributionModalOpen: boolean;
  currentGoalId: string | null;
  currentGoalName: string | null;
  currentGoalCurrency: Currency | null;
  maxAmount: number | null;
  openContributionModal: (goalId: string, goalName: string, currency: Currency, maxAmount: number) => void;
  closeContributionModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  const [currentGoalName, setCurrentGoalName] = useState<string | null>(null);
  const [currentGoalCurrency, setCurrentGoalCurrency] = useState<Currency | null>(null);
  const [maxAmount, setMaxAmount] = useState<number | null>(null);

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

  return (
    <ModalContext.Provider value={{
      isContributionModalOpen,
      currentGoalId,
      currentGoalName,
      currentGoalCurrency,
      maxAmount,
      openContributionModal,
      closeContributionModal
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