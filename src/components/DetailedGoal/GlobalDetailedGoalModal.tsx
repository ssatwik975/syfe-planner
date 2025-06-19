import { useModalContext } from '../../context/ModalContext';
import DetailedGoalModal from './DetailedGoalModal';

const GlobalDetailedGoalModal = () => {
  const {
    isDetailedGoalModalOpen,
    currentDetailedGoal,
    closeDetailedGoalModal
  } = useModalContext();

  // Only render if all required props are available
  if (!isDetailedGoalModalOpen || !currentDetailedGoal) {
    return null;
  }

  return (
    <DetailedGoalModal
      goal={currentDetailedGoal}
      isOpen={isDetailedGoalModalOpen}
      onClose={closeDetailedGoalModal}
    />
  );
};

export default GlobalDetailedGoalModal;