import { useState, useEffect, useRef } from 'react';
import type { Currency, FormErrors, GoalFormData } from '../../types/goals';
import styles from './AddGoalForm.module.css';

interface AddGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: GoalFormData) => void;
  existingGoalNames: string[];
}

const AddGoalForm = ({ isOpen, onClose, onSubmit, existingGoalNames }: AddGoalFormProps) => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isExiting, setIsExiting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // ==========================================================================
  // ANIMATION & MODAL CONTROL
  // ==========================================================================
  const handleClose = () => {
    if (isExiting) return; // Prevent multiple calls
    
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 300); // Match animation duration
  };
  
  // ==========================================================================
  // FORM VALIDATION & SUBMISSION
  // ==========================================================================
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = 'Goal name is required';
    } else if (existingGoalNames.includes(trimmedTitle)) {
      newErrors.title = 'A goal with this name already exists';
    }
    
    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }
    
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    const { isValid, errors: newErrors } = validateForm();
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    // Set submitting state and start exit animation
    setIsSubmitting(true);
    setIsExiting(true);
    
    // Wait for animation, then submit and close
    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        amount: parseFloat(amount),
        currency
      });
      
      // Reset states
      setIsExiting(false);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  // ==========================================================================
  // INPUT HANDLING
  // ==========================================================================
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalPoint = value.match(/\./g)?.length || 0;
    if (decimalPoint <= 1) {
      setAmount(value);
    }
  };

  // ==========================================================================
  // EFFECTS & LIFECYCLE
  // ==========================================================================
  // Reset form and setup listeners when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form
      setTitle('');
      setAmount('');
      setCurrency('USD');
      setErrors({});
      setIsExiting(false);
      setIsSubmitting(false);

      // Focus on title input when modal opens
      setTimeout(() => titleInputRef.current?.focus(), 100);

      // Setup click outside handler
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          handleClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Don't render anything if modal is not open and not animating out
  if (!isOpen && !isExiting) return null;

  // ==========================================================================
  // RENDER UI
  // ==========================================================================
  return (
    <div className={`${styles.modalOverlay} ${isExiting ? styles.fadeOut : styles.fadeIn}`}>
      <div 
        className={`${styles.modalContainer} ${isExiting ? styles.slideOut : styles.slideIn}`}
        ref={modalRef}
      >
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            <div className={styles.modalIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="#4F67FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="#4F67FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Add New Goal</h2>
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
        
        {/* Form Content */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Goal Name Field */}
          <div className={styles.formGroup}>
            <label htmlFor="goalTitle">Goal Name</label>
            <div className={styles.inputWrapper}>
              <input
                ref={titleInputRef}
                type="text"
                id="goalTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Emergency Fund, New Laptop"
                className={errors.title ? styles.inputError : ''}
                disabled={isSubmitting}
              />
            </div>
            {errors.title && <p className={styles.errorText}>{errors.title}</p>}
          </div>

          {/* Amount & Currency Selection */}
          <div className={styles.formGroup}>
            <label htmlFor="goalAmount">Target Amount</label>
            <div className={styles.amountInputGroup}>
              {/* Amount Input */}
              <div className={styles.inputWrapper}>
                <input
                  type="text" 
                  inputMode="decimal"
                  id="goalAmount"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0.00"
                  className={errors.amount ? styles.inputError : ''}
                  disabled={isSubmitting}
                />
                <span className={styles.currencyIndicator}>{currency}</span>
              </div>
              
              {/* Currency Toggle */}
              <div className={styles.currencyToggleContainer}>
                <label className={styles.currencyLabel}>Currency</label>
                <div 
                  className={`${styles.currencyToggle} ${currency === 'USD' ? styles.leftActive : styles.rightActive}`}
                >
                  <button
                    type="button"
                    className={`${styles.currencyOption} ${currency === 'USD' ? styles.active : ''}`}
                    onClick={() => setCurrency('USD')}
                    disabled={isSubmitting}
                  >
                    USD
                  </button>
                  <button
                    type="button" 
                    className={`${styles.currencyOption} ${currency === 'INR' ? styles.active : ''}`}
                    onClick={() => setCurrency('INR')}
                    disabled={isSubmitting}
                  >
                    INR
                  </button>
                  <span className={styles.activeIndicator}></span>
                </div>
              </div>
            </div>
            {errors.amount && <p className={styles.errorText}>{errors.amount}</p>}
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.loadingSpinner}>
                  <span className={styles.loadingDot}></span>
                  <span className={styles.loadingDot}></span>
                  <span className={styles.loadingDot}></span>
                </span>
              ) : (
                'Add Goal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalForm;