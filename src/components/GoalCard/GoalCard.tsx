import type { Goal } from '../../types/goals';
import styles from './GoalCard.module.css';

interface GoalCardProps {
    goal: Goal;
}

const GoalCard = ({ goal: { title, amount, currency } }: GoalCardProps) => {
    const formattedAmount = `${currency} ${amount.toLocaleString(undefined, { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })}`;
    
    return (
        <div className={styles.goalCard}>
            <h3 className={styles.goalTitle}>{title}</h3>
            <p className={styles.goalAmount}>{formattedAmount}</p>
        </div>
    );
};

export default GoalCard;