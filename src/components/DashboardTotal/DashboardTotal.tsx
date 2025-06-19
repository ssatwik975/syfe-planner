import { useGoalContext } from '../../context/GoalContext';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './DashboardTotal.module.css';

const DashboardTotal = () => {
  const { 
    getTotalTarget, 
    getTotalSaved, 
    getOverallProgress, 
    exchangeRates, 
    updateExchangeRates, 
    isLoading 
  } = useGoalContext();
  
  // Use INR as the main currency for the dashboard based on the design
  const totalTargetINR = getTotalTarget('INR');
  const totalSavedINR = getTotalSaved('INR');
  const totalTargetUSD = getTotalTarget('USD');
  const totalSavedUSD = getTotalSaved('USD');
  const progress = getOverallProgress();
  
  // Format the date and time
  const formattedDate = new Date(exchangeRates.lastUpdated).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <div className={styles.overviewTitle}>
          <svg className={styles.chartIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L7 5M7 5L11 9M7 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 15L17 19M17 19L13 15M17 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2>Financial Overview</h2>
        </div>
        <button 
          className={styles.refreshButton}
          onClick={updateExchangeRates}
          disabled={isLoading}
        >
          <svg className={`${styles.refreshIcon} ${isLoading ? styles.spin : ''}`} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 9C1 4.58172 4.58172 1 9 1C12.3949 1 15.2959 3.0899 16.4576 6M17 9C17 13.4183 13.4183 17 9 17C5.60514 17 2.70405 14.9101 1.54245 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 4V6H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 14V12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {isLoading ? 'Updating...' : 'Refresh Rates'}
        </button>
      </div>

      <div className={styles.summaryStats}>
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <h3>Total Targets</h3>
          </div>
          <div className={styles.amountDisplay}>
            <p className={styles.primaryAmount}>₹{Math.round(totalTargetINR).toLocaleString('en-IN')}</p>
            <p className={styles.secondaryAmount}>${Math.round(totalTargetUSD).toLocaleString('en-US')}</p>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 17L12 22L22 17M2 12L12 17L22 12M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Total Saved</h3>
          </div>
          <div className={styles.amountDisplay}>
            <p className={styles.primaryAmount}>₹{Math.round(totalSavedINR).toLocaleString('en-IN')}</p>
            <p className={styles.secondaryAmount}>${Math.round(totalSavedUSD).toLocaleString('en-US')}</p>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 2V6M16 2V6M2 10H22M7 14H9M12 14H14M17 14H19M7 18H9M12 18H14M17 18H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Overall Progress</h3>
          </div>
          <div className={styles.progressDisplay}>
            <p className={styles.progressPercentage}>{progress.toFixed(1)}%</p>
            <p className={styles.progressText}>Total goals completion</p>
          </div>
        </div>
      </div>
      
      <ProgressBar progress={progress} className={styles.dashboardProgressBar} />
      
      <div className={styles.bottomSection}>
        <div className={styles.exchangeRate}>
          <span>Exchange Rate: 1 USD = ₹{exchangeRates.USD_INR.toFixed(2)}</span>
        </div>
        <div className={styles.lastUpdated}>
          <span>Last updated: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTotal;