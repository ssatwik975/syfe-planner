import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // 0-100
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={styles.progressContainer}>
      <div 
        className={styles.progressBar} 
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;