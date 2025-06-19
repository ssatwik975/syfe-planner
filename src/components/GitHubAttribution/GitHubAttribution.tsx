import styles from './GitHubAttribution.module.css';

const GitHubAttribution = () => {
  return (
    <a 
      href="https://github.com/ssatwik975" 
      target="_blank" 
      rel="noopener noreferrer" 
      className={styles.attributionPill}
      aria-label="Made by Satwik Singh - Visit GitHub Profile"
    >
      <div className={styles.profileImageContainer}>
        <img 
          src="https://github.com/ssatwik975.png" 
          alt="Satwik Singh's GitHub avatar" 
          className={styles.profileImage}
          onError={(e) => {
            // Fallback if GitHub image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333'%3E%3Cpath d='M12 0a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.4 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.1-.4-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 016 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.9 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0012 0z'/%3E%3C/svg%3E";
            target.classList.add(styles.fallbackIcon);
          }}
        />
      </div>
      <span className={styles.attributionText}>Over-engineered by Satwik Singh</span>
      <svg className={styles.arrowIcon} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.5 10.5L10.5 3.5M10.5 3.5H4.5M10.5 3.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
};

export default GitHubAttribution;