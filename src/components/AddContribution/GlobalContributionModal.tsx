import AddContribution from './AddContribution';
import { useModalContext } from '../../context/ModalContext';

const GlobalContributionModal = () => {
  const {
    isContributionModalOpen,
    currentGoalId,
    currentGoalName,
    currentGoalCurrency,
    closeContributionModal
  } = useModalContext();

  // Only render if we have all required props
  if (!isContributionModalOpen || !currentGoalId || !currentGoalName || !currentGoalCurrency) {
    return null;
  }

  return (
    <AddContribution
      goalId={currentGoalId}
      goalName={currentGoalName}
      currency={currentGoalCurrency}
      isOpen={isContributionModalOpen}
      onClose={closeContributionModal}
    />
  );
};

export default GlobalContributionModal;