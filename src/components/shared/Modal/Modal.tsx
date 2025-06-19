import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  isSubmitting?: boolean;
}

const Modal = ({ isOpen, onClose, title, icon, children, isSubmitting = false }: ModalProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle close animation
  const handleClose = () => {
    if (isExiting || isSubmitting) return;
    
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 300); // Match animation duration
  };
  
  // Handle click outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isSubmitting) {
          handleClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isSubmitting]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) handleClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting]);

  // Don't render anything if modal is not open and not animating out
  if (!isOpen && !isExiting) return null;
  
  return (
    <div className={`${styles.modalOverlay} ${isExiting ? styles.fadeOut : styles.fadeIn}`}>
      <div 
        className={`${styles.modalContainer} ${isExiting ? styles.slideOut : styles.slideIn}`}
        ref={modalRef}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            {icon && <div className={styles.modalIcon}>{icon}</div>}
            <h2>{title}</h2>
          </div>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;