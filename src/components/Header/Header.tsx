import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.headerSection}>
      <div className={styles.headerTitleRow}>
        <div className={styles.logo}>
            <img 
                src="/logo.svg" 
                alt="Logo" 
                className={styles.logoImage}
                width="50"
                height="50"
            />
        
          <h1 className={styles.headerTitle}>Syfe Savings Planner</h1>
        </div>
        <p className={styles.headerSubtitle}>Track your financial goals and build your future</p>
      </div>
    </header>
  );
};

export default Header;