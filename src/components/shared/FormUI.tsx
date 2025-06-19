import React, { ReactNode } from 'react';
import styles from './FormUI.module.css';
import { Currency } from '../../types/goals';

// Form Group Component
export const FormGroup: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`${styles.formGroup} ${className}`}>{children}</div>;
};

// Input Wrapper
export const InputWrapper: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`${styles.inputWrapper} ${className}`}>{children}</div>;
};

// Label Component
export const Label: React.FC<{
  htmlFor: string;
  children: ReactNode;
  className?: string;
}> = ({ htmlFor, children, className = '' }) => {
  return (
    <label htmlFor={htmlFor} className={`${styles.label} ${className}`}>
      {children}
    </label>
  );
};

// Error Text Component
export const ErrorText: React.FC<{
  error?: string;
}> = ({ error }) => {
  if (!error) return null;
  return <p className={styles.errorText}>{error}</p>;
};

// Currency Toggle
interface CurrencyToggleProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  disabled?: boolean;
  label?: string;
}

export const CurrencyToggle: React.FC<CurrencyToggleProps> = ({
  currency,
  setCurrency,
  disabled = false,
  label = "Currency"
}) => {
  return (
    <div className={styles.currencyToggleContainer}>
      {label && <label className={styles.currencyLabel}>{label}</label>}
      <div
        className={`${styles.currencyToggle} ${currency === 'USD' ? styles.leftActive : styles.rightActive}`}
      >
        <button
          type="button"
          className={`${styles.currencyOption} ${currency === 'USD' ? styles.active : ''}`}
          onClick={() => setCurrency('USD')}
          disabled={disabled}
        >
          USD
        </button>
        <button
          type="button"
          className={`${styles.currencyOption} ${currency === 'INR' ? styles.active : ''}`}
          onClick={() => setCurrency('INR')}
          disabled={disabled}
        >
          INR
        </button>
        <span className={styles.activeIndicator}></span>
      </div>
    </div>
  );
};

// Form Actions
interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting = false,
  submitText = 'Submit'
}) => {
  return (
    <div className={styles.formActions}>
      <button
        type="button"
        className={styles.cancelButton}
        onClick={onCancel}
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
          submitText
        )}
      </button>
    </div>
  );
};

// Currency Info Text
interface ConversionInfoProps {
  sourceCurrency: Currency;
  targetCurrency: Currency;
  conversionRate: number;
}

export const ConversionInfo: React.FC<ConversionInfoProps> = ({
  sourceCurrency,
  targetCurrency,
  conversionRate
}) => {
  if (sourceCurrency === targetCurrency) return null;
  
  return (
    <p className={styles.conversionInfo}>
      <small>
        Your contribution will be converted to {targetCurrency} 
        (1 {sourceCurrency} = {conversionRate.toFixed(2)} {targetCurrency})
      </small>
    </p>
  );
};