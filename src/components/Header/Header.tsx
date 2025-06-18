import TargetIcon from '../../assets/TargetIcon';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.headerSection}>
      <div className={styles.headerTitleRow}>
        <div className={styles.logo}>
          <TargetIcon />
          <h1 className={styles.headerTitle}>Syfe Savings Planner</h1>
        </div>
        <p className={styles.headerSubtitle}>Track your financial goals and build your future</p>
      </div>
    </header>
  );
};

export default Header;