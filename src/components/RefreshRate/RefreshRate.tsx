import { useGoalContext } from '../../context/GoalContext';
import styles from './RefreshRate.module.css';

const RefreshRate = () => {
  const { updateExchangeRates, exchangeRates, isLoading } = useGoalContext();
  
  // Format the timestamp to readable format
  const formattedDate = new Date(exchangeRates.lastUpdated).toLocaleString();
  
  return (
    <div className={styles.refreshContainer}>
      <div className={styles.ratesInfo}>
        <span className={styles.exchangeRates}>
          1 USD = {exchangeRates.USD_INR.toFixed(2)} INR | 
          1 INR = {exchangeRates.INR_USD.toFixed(4)} USD
        </span>
        <span className={styles.lastUpdated}>
          Last updated: {formattedDate}
        </span>
      </div>
      <button 
        className={styles.refreshButton}
        onClick={updateExchangeRates}
        disabled={isLoading}
      >
        {isLoading ? 'Updating...' : 'Refresh Rates'}
      </button>
    </div>
  );
};

export default RefreshRate;