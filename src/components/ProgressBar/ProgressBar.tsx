import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number; // 0-100
  isComplete?: boolean;
  className?: string;
}

const ProgressBar = ({ progress, isComplete = false, className = '' }: ProgressBarProps) => {
  // Ensure progress is between 0-100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`${styles.progressContainer} ${className}`}>
      <div 
        className={`${styles.progressBar} ${isComplete ? styles.completed : ''}`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;