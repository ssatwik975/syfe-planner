import type { Goal } from '../../types/goals';
import { useGoalContext } from '../../context/GoalContext';
import { useModalContext } from '../../context/ModalContext';
import { formatCurrency } from '../../utils/api';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './GoalCard.module.css';

interface GoalCardProps {
    goal: Goal;
}

const GoalCard = ({ goal }: GoalCardProps) => {
    const { exchangeRates } = useGoalContext();
    const { openContributionModal } = useModalContext();
    
    const { id, title, amount, currency, savedAmount, contributions } = goal;
    
    // Calculate progress percentage
    const progress = amount > 0 ? (savedAmount / amount) * 100 : 0;
    const progressFormatted = Math.round(progress);
    
    // Calculate remaining amount
    const remainingAmount = amount - savedAmount;
    
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
        openContributionModal(id, title, currency);
    };

    // Format the contribution count
    const contributionCount = contributions.length;
    const contributionText = `${contributionCount} contribution${contributionCount !== 1 ? 's' : ''}`;
    
    return (
        <div className={styles.goalCard}>
            <div className={styles.goalHeader}>
                <h3 className={styles.goalTitle}>{title}</h3>
                <div className={styles.progressPill}>{progressFormatted}%</div>
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
                    <span className={styles.savedAmount}>{formattedSavedAmount} saved</span>
                </div>
                
                <ProgressBar progress={progress} />
                
                <div className={styles.progressFooter}>
                    <span className={styles.contributionCount}>{contributionText}</span>
                    <span className={styles.remainingAmount}>{formattedRemainingAmount} remaining</span>
                </div>
            </div>
            
            <button 
                className={styles.addContributionButton}
                onClick={handleAddContribution}
            >
                <span className={styles.plusIcon}>+</span>
                Add Contribution
            </button>
        </div>
    );
};

export default GoalCard;