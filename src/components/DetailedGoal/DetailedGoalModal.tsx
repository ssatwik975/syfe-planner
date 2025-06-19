import { useState, useEffect } from 'react';
import Modal from '../shared/Modal/Modal';
import { 
  formatCurrency, 
  calculateProgress, 
  isGoalComplete, 
  calculateRemainingAmount, 
  formatDate, 
  validateAmount,
  sortContributionsByDate
} from '../../utils';
import type { Goal, Contribution } from '../../types/goals';
import ProgressBar from '../ProgressBar/ProgressBar';
import { useGoalContext } from '../../context/GoalContext';
import { useModalContext } from '../../context/ModalContext';
import styles from './DetailedGoalModal.module.css';
import ContributionItem from '../ContributionItem/ContributionItem';

interface DetailedGoalModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
}

const DetailedGoalModal = ({ goal, isOpen, onClose }: DetailedGoalModalProps) => {
  const { removeGoal, updateGoalAmount } = useGoalContext();
  const { currentDetailedGoal } = useModalContext();
  
  // State for tab navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'contributions'>('overview');
  
  // State for editing target amount
  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState<string>(goal.amount.toString());
  const [editError, setEditError] = useState<string | null>(null);
  
  // Use the latest goal data from context
  const { id, title, amount, currency, savedAmount, contributions, createdAt } = currentDetailedGoal || 
    { ...goal, createdAt: new Date().toISOString() }; // Provide a fallback for createdAt
  
  // Update the new amount state when the goal changes
  useEffect(() => {
    if (currentDetailedGoal) {
      setNewAmount(currentDetailedGoal.amount.toString());
    }
  }, [currentDetailedGoal]);
  
  // Calculate progress percentage
  const progress = calculateProgress(savedAmount, amount);
  const remainingAmount = calculateRemainingAmount(amount, savedAmount);
  const isComplete = isGoalComplete(savedAmount, amount);
  
  // Format currency amounts
  const formattedAmount = formatCurrency(amount, currency);
  const formattedSavedAmount = formatCurrency(savedAmount, currency);
  const formattedRemainingAmount = formatCurrency(remainingAmount, currency);
  
  // Format creation date
  const creationDate = createdAt ? formatDate(createdAt) : formatDate(new Date().toISOString());
  

  // Handle removing a goal
  const handleRemoveGoal = () => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      removeGoal(id);
      onClose();
    }
  };
  
  // Handle editing target amount
  const handleEditAmount = () => {
    setIsEditing(true);
    setNewAmount(amount.toString());
  };
  
  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalPoint = value.match(/\./g)?.length || 0;
    
    // Get the parts before and after decimal
    const parts = value.split('.');
    const beforeDecimal = parts[0] || '';
    
    // Check if the digits before decimal exceed the limit
    if (beforeDecimal.length > 10) { // Limit to 10 digits
      return; // Don't update if exceeds digit limit
    }
    
    if (decimalPoint <= 1) {
      setNewAmount(value);
      setEditError(null);
    }
  };
  
  // Handle save new amount
  const handleSaveAmount = () => {
    const parsedAmount = parseFloat(newAmount);
    
    // Validate amount using utility function
    const validation = validateAmount(newAmount, savedAmount, 1000000000);
    
    if (!validation.isValid) {
      setEditError(validation.error);
      return;
    }
    
    // Update goal amount
    updateGoalAmount(id, parsedAmount);
    setIsEditing(false);
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError(null);
  };

  // Goal icon for modal
  const goalIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="#4F67FF" strokeWidth="2"/>
      <circle cx="12" cy="12" r="5" stroke="#4F67FF" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" fill="#4F67FF"/>
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={goalIcon}
    >
      <div className={styles.modalContent}>
        <div className={styles.actionButtons}>
          <button 
            className={styles.editButton} 
            onClick={handleEditAmount}
            disabled={isEditing || isComplete}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.5 2.5L13.5 4.5M2.5 13.5H4.5L12.5 5.5L10.5 3.5L2.5 11.5V13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Target
          </button>
          <button 
            className={styles.removeButton} 
            onClick={handleRemoveGoal}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 4.5H13.5M5.5 2.5H10.5M6.5 7.5V11.5M9.5 7.5V11.5M3.5 4.5L4.5 13.5H11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Remove Goal
          </button>
        </div>
        
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'contributions' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('contributions')}
          >
            History <span className={styles.countBadge}>{contributions.length}</span>
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className={styles.overviewTab}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Target Amount</span>
                {isEditing ? (
                  <div className={styles.editAmountContainer}>
                    <div className={styles.inputWrapper}>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={newAmount}
                        onChange={handleAmountChange}
                        className={editError ? styles.inputError : ''}
                        autoFocus
                      />
                      <span className={styles.currencyIndicator}>{currency}</span>
                    </div>
                    {editError && <p className={styles.errorText}>{editError}</p>}
                    <div className={styles.editActions}>
                      <button 
                        className={styles.saveButton} 
                        onClick={handleSaveAmount}
                      >
                        Save
                      </button>
                      <button 
                        className={styles.cancelButton} 
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className={styles.statValue}>{formattedAmount}</span>
                )}
              </div>
              
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Amount Saved</span>
                <span className={styles.statValue}>{formattedSavedAmount}</span>
              </div>
              
              <div className={styles.statCard}>
                <span className={styles.statLabel}>{isComplete ? 'Status' : 'Remaining'}</span>
                <span className={`${styles.statValue} ${isComplete ? styles.completedStatus : ''}`}>
                  {isComplete ? 'Completed!' : formattedRemainingAmount}
                </span>
              </div>
              
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Progress</span>
                <span className={`${styles.statValue} ${styles.progressValue} ${isComplete ? styles.completedStatus : ''}`}>
                  {progress.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className={styles.progressSection}>
              <ProgressBar progress={progress} isComplete={isComplete} className={styles.detailedProgress} />
              <div className={styles.createdText}>
                Goal created: {creationDate}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.contributionsTab}>
            {contributions.length === 0 ? (
              <div className={styles.noData}>
                <svg className={styles.emptyIcon} width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4V44M36 12L24 24L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>No contributions have been made yet</p>
                <span>Add your first contribution to start tracking progress</span>
              </div>
            ) : (
              <div className={styles.contributionsList}>
                {sortContributionsByDate(contributions).map((contribution: Contribution) => (
                  <ContributionItem 
                    key={contribution.id} 
                    contribution={contribution} 
                    currency={currency}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DetailedGoalModal;