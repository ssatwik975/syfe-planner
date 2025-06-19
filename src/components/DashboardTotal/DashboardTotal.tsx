import { useGoalContext } from '../../context/GoalContext';
import { formatCurrency } from '../../utils/api';
import ProgressBar from '../ProgressBar/ProgressBar';
import styles from './DashboardTotal.module.css';

const DashboardTotal = () => {
  const { getTotalTarget, getTotalSaved, getOverallProgress } = useGoalContext();
  
  // Use USD as the main currency for the dashboard
  const totalTarget = getTotalTarget('USD');
  const totalSaved = getTotalSaved('USD');
  const progress = getOverallProgress();
  
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.summaryStats}>
        <div className={styles.statItem}>
          <h3>Total Target</h3>
          <p className={styles.statValue}>{formatCurrency(totalTarget, 'USD')}</p>
        </div>
        
        <div className={styles.statItem}>
          <h3>Total Saved</h3>
          <p className={styles.statValue}>{formatCurrency(totalSaved, 'USD')}</p>
        </div>
        
        <div className={styles.statItem}>
          <h3>Overall Progress</h3>
          <p className={styles.statValue}>{progress.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className={styles.progressSection}>
        <ProgressBar progress={progress} />
      </div>
    </div>
  );
};

export default DashboardTotal;