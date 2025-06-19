import type { Goal } from '../../types/goals';
import { useGoalContext } from '../../context/GoalContext';
import { useModalContext } from '../../context/ModalContext';
import { formatCurrency } from '../../utils/api';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './GoalCard.module.css';

interface GoalCardProps {
    goal: Goal;
}

const MAX_TITLE_LENGTH = 30; // Character limit for goal titles

const GoalCard = ({ goal }: GoalCardProps) => {
    const { exchangeRates } = useGoalContext();
    const { openContributionModal, openDetailedGoalModal } = useModalContext();
    
    const { id, title, amount, currency, savedAmount, contributions } = goal;
    
    // Format title with character limit
    const formattedTitle = title.length > MAX_TITLE_LENGTH 
        ? `${title.substring(0, MAX_TITLE_LENGTH)}...` 
        : title;
    
    // Calculate progress percentage
    const progress = amount > 0 ? (savedAmount / amount) * 100 : 0;
    const progressFormatted = Math.round(progress);
    const isComplete = savedAmount >= amount;
    
    // Calculate remaining amount
    const remainingAmount = Math.max(0, amount - savedAmount);
    
    // Format the primary currency amount
    const formattedAmount = formatCurrency(amount, currency);
    const formattedSavedAmount = formatCurrency(savedAmount, currency);
    const formattedRemainingAmount = formatCurrency(remainingAmount, currency);
    
    // Calculate and format the converted amount
    const conversionRate = currency === 'USD' ? exchangeRates.USD_INR : exchangeRates.INR_USD;
    const convertedCurrency = currency === 'USD' ? 'INR' : 'USD';
    const convertedAmount = amount * conversionRate;
    const formattedConvertedAmount = formatCurrency(convertedAmount, convertedCurrency);
    
    const handleAddContribution = () => {
        openContributionModal(id, title, currency, remainingAmount);
    };

    const handleShowDetails = () => {
        openDetailedGoalModal(goal);
    };

    // Format the contribution count
    const contributionCount = contributions.length;
    const contributionText = `${contributionCount} contribution${contributionCount !== 1 ? 's' : ''}`;
    
    return (
        <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
                <h3 className={styles.goalTitle} title={title}>{formattedTitle}</h3>
                <div className={`${styles.progressPill} ${isComplete ? styles.completed : ''}`}>
                    {isComplete && (
                        <svg className={styles.checkIcon} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                    {progressFormatted}%
                </div>
            </div>
            
            <div className={styles.primaryAmount}>
                {currency === 'INR' ? '₹' : '$'}
                {amount.toLocaleString()}
            </div>
            
            <div className={styles.secondaryAmount}>
                {formattedConvertedAmount}
            </div>
            
            <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Progress</span>
                    <span className={`${styles.savedAmount} ${isComplete ? styles.completed : ''}`}>
                        {formattedSavedAmount} saved
                    </span>
                </div>
                
                <ProgressBar progress={progress} isComplete={isComplete} />
                
                <div className={styles.progressFooter}>
                    <span className={styles.contributionCount}>{contributionText}</span>
                    <span className={styles.remainingAmount}>
                        {isComplete ? "Goal completed!" : `${formattedRemainingAmount} remaining`}
                    </span>
                </div>
            </div>
            
            <div className={styles.cardButtons}>
                <button 
                    className={styles.detailsButton}
                    onClick={handleShowDetails}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3.33325V12.6666M8 3.33325L12 7.33325M8 3.33325L4 7.33325" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Details
                </button>
                
                <button 
                    className={styles.addContributionButton}
                    onClick={handleAddContribution}
                    disabled={isComplete}
                >
                    <span className={styles.plusIcon}>+</span>
                    {isComplete ? "Completed" : "Add"}
                </button>
            </div>
        </div>
    );
};

export default GoalCard;