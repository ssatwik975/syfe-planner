import type { Currency } from '../../types/goals';
import { formatCurrency, formatDate } from '../../utils';
import styles from './ContributionItem.module.css';

interface ContributionItemProps {
  contribution: {
    id: string;
    amount: number;
    date: string;
    note?: string;
  };
  currency: Currency;
}

const ContributionItem = ({ contribution, currency }: ContributionItemProps) => {
  const { amount, date, note } = contribution;
  
  // Format just the date part (no time)
  const formattedDate = formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={styles.contributionItem}>
      <div className={styles.contributionHeader}>
        <span className={styles.contributionAmount}>{formatCurrency(amount, currency)}</span>
        <span className={styles.contributionDate}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 5H2M3 1V2M9 1V2M2.6 10H9.4C9.73137 10 10 9.73137 10 9.4V3.6C10 3.26863 9.73137 3 9.4 3H2.6C2.26863 3 2 3.26863 2 3.6V9.4C2 9.73137 2.26863 10 2.6 10Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {formattedDate}
        </span>
      </div>
      
      {note && (
        <div className={styles.contributionNote}>
          <p>{note}</p>
        </div>
      )}
    </div>
  );
};

export default ContributionItem;