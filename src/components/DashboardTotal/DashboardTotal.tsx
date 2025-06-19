import { useGoalContext } from '../../context/GoalContext';
import { formatCurrency } from '../../utils';
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
          <img 
            src="/financialOverview.svg" 
            alt="Financial Overview" 
            className={styles.chartIcon} 
            width="24" 
            height="24"
          />
          <h2>Financial Overview</h2>
        </div>
        <button 
          className={styles.refreshButton}
          onClick={() => updateExchangeRates(true)}
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
            <p className={styles.primaryAmount}>{formatCurrency(totalTargetINR, 'INR')}</p>
            <p className={styles.secondaryAmount}>{formatCurrency(totalTargetUSD, 'USD')}</p>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <img 
                src="/totalSaved.svg" 
                alt="Total Saved" 
                width="22" 
                height="22"
              />
            </div>
            <h3>Total Saved</h3>
          </div>
          <div className={styles.amountDisplay}>
            <p className={styles.primaryAmount}>{formatCurrency(totalSavedINR, 'INR')}</p>
            <p className={styles.secondaryAmount}>{formatCurrency(totalSavedUSD, 'USD')}</p>
          </div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statHeader}>
            <div className={styles.statIcon}>
              <img 
                src="/overallProgress.svg" 
                alt="Overall Progress" 
                width="24" 
                height="24"
              />
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