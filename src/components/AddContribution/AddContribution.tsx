import { useState, useRef, useEffect } from 'react';
import { Currency } from '../../types/goals';
import { useGoalContext } from '../../context/GoalContext';
import Modal from '../shared/Modal/Modal';
import { 
  FormGroup, 
  InputWrapper, 
  Label, 
  ErrorText, 
  CurrencyToggle, 
  FormActions,
  ConversionInfo
} from '../shared/FormUI';
import styles from './AddContribution.module.css';

interface AddContributionProps {
  goalId: string;
  goalName: string;
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
}

const AddContribution = ({ 
  goalId, 
  goalName, 
  currency: goalCurrency, 
  isOpen, 
  onClose 
}: AddContributionProps) => {
  // State Management
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>(goalCurrency);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addContribution, exchangeRates } = useGoalContext();
  const amountInputRef = useRef<HTMLInputElement>(null);
  
  // Input Handling
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const decimalPoint = value.match(/\./g)?.length || 0;
    if (decimalPoint <= 1) {
      setAmount(value);
    }
  };
  
  // Form Validation & Submission
  const validateForm = () => {
    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      return { isValid: false, error: 'Please enter a valid positive amount' };
    }
    return { isValid: true, error: null };
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    const { isValid, error: newError } = validateForm();
    
    if (!isValid) {
      setError(newError);
      return;
    }
    
    // Set submitting state
    setIsSubmitting(true);
    
    // Convert amount if necessary
    let finalAmount = parseFloat(amount);
    if (currency !== goalCurrency) {
      // Convert the contribution to match the goal's currency
      const conversionRate = 
        currency === 'USD' && goalCurrency === 'INR' 
          ? exchangeRates.USD_INR 
          : exchangeRates.INR_USD;
      finalAmount = finalAmount * conversionRate;
    }
    
    // Submit with a slight delay to show loading state
    setTimeout(() => {
      addContribution({
        goalId,
        amount: finalAmount,
        note: note.trim() || undefined
      });
      
      // Reset states
      setIsSubmitting(false);
      onClose();
    }, 500);
  };
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form
      setAmount('');
      setNote('');
      setError(null);
      setCurrency(goalCurrency);
      setIsSubmitting(false);

      // Focus on amount input when modal opens
      setTimeout(() => amountInputRef.current?.focus(), 100);
    }
  }, [isOpen, goalCurrency]);
  
  // Get conversion rate info for display
  const conversionRate = 
    currency === 'USD' && goalCurrency === 'INR' 
      ? exchangeRates.USD_INR 
      : currency === 'INR' && goalCurrency === 'USD'
        ? exchangeRates.INR_USD
        : 1;
  
  const contributionIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v20M17 7l-5-5-5 5M17 17l-5 5-5-5" stroke="#4F67FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Contribution" 
      icon={contributionIcon}
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.goalInfo}>
          Contributing to: <strong>{goalName}</strong> ({goalCurrency})
        </div>
        
        {/* Amount Input */}
        <FormGroup>
          <Label htmlFor="contributionAmount">Amount</Label>
          <InputWrapper>
            <input
              ref={amountInputRef}
              type="text" 
              inputMode="decimal"
              id="contributionAmount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={error ? styles.inputError : ''}
              disabled={isSubmitting}
            />
            <span className={styles.currencyIndicator}>{currency}</span>
          </InputWrapper>
          <ErrorText error={error || undefined} />
        </FormGroup>
        
        {/* Currency Toggle */}
        <FormGroup>
          <CurrencyToggle 
            currency={currency}
            setCurrency={setCurrency}
            disabled={isSubmitting}
            label="Contribution Currency"
          />
          <ConversionInfo 
            sourceCurrency={currency}
            targetCurrency={goalCurrency}
            conversionRate={conversionRate}
          />
        </FormGroup>
        
        {/* Note Field */}
        <FormGroup>
          <Label htmlFor="contributionNote">
            Note <span className={styles.optionalLabel}>(optional)</span>
          </Label>
          <InputWrapper>
            <textarea
              id="contributionNote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Birthday money, Bonus"
              rows={2}
              className={styles.noteTextarea}
              disabled={isSubmitting}
            />
          </InputWrapper>
        </FormGroup>
        
        {/* Form Actions */}
        <FormActions
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitText="Add Contribution"
        />
      </form>
    </Modal>
  );
};

export default AddContribution;