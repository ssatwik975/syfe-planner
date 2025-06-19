import { useGoalContext } from '../../context/GoalContext';
import styles from './RefreshRate.module.css';

const RefreshRate = () => {
  const { updateExchangeRates, exchangeRates, isLoading, error } = useGoalContext();
  
  // Format the timestamp to readable format
  const formattedDate = new Date(exchangeRates.lastUpdated).toLocaleString();
  
  // Handle refresh click - force refresh
  const handleRefreshClick = () => {
    updateExchangeRates();
  };
  
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
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
      <button 
        className={styles.refreshButton}
        onClick={handleRefreshClick}
        disabled={isLoading}
      >
        <img 
          src="/refresh.svg" 
          alt="Refresh icon" 
          className={isLoading ? styles.spinningIcon : styles.refreshIcon} 
        />
        {isLoading ? 'Updating...' : 'Refresh Rates'}
      </button>
    </div>
  );
};

export default RefreshRate;