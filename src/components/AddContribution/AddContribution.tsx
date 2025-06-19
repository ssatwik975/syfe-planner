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
  maxAmount: number;
  isOpen: boolean;
  onClose: () => void;
}

const AddContribution = ({ 
  goalId, 
  goalName, 
  currency: goalCurrency,
  maxAmount,
  isOpen, 
  onClose 
}: AddContributionProps) => {
  // State Management
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>(goalCurrency);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exceedsMax, setExceedsMax] = useState(false);
  
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
      
      // Check if exceeds maximum
      const amountValue = parseFloat(value);
      if (!isNaN(amountValue)) {
        // Calculate max contribution in current currency
        let maxAllowedAmount = maxAmount;
        if (currency !== goalCurrency) {
          // Convert max amount to the contribution currency
          const conversionRate = 
            currency === 'USD' && goalCurrency === 'INR' 
              ? exchangeRates.INR_USD  // INR -> USD
              : exchangeRates.USD_INR; // USD -> INR
          maxAllowedAmount = maxAmount * conversionRate;
        }
        
        setExceedsMax(amountValue > maxAllowedAmount);
      } else {
        setExceedsMax(false);
      }
      
      // Clear error when user types
      if (error) {
        setError(null);
      }
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

    // Check if this contribution will complete the goal
    const willCompleteGoal = finalAmount >= maxAmount;
    
    // Submit with a slight delay to show loading state
    setTimeout(() => {
      addContribution({
        goalId,
        amount: finalAmount > maxAmount ? maxAmount : finalAmount, // Ensure we don't exceed the max
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
      setExceedsMax(false);
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

  // Calculate max amount in current currency
  let displayMaxAmount = maxAmount;
  if (currency !== goalCurrency) {
    const conversionRate = 
      currency === 'USD' && goalCurrency === 'INR' 
        ? exchangeRates.INR_USD  // INR -> USD
        : exchangeRates.USD_INR; // USD -> INR
    displayMaxAmount = maxAmount * conversionRate;
  }
  
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
        <div className={styles.goalNameDisplay}>
          <h3 className={styles.goalNameTitle}>{goalName}</h3>
          <span className={styles.goalCurrency}>({goalCurrency})</span>
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
              className={error ? styles.inputError : exceedsMax ? styles.inputWarning : ''}
              disabled={isSubmitting}
            />
            <span className={styles.currencyIndicator}>{currency}</span>
          </InputWrapper>
          {error ? (
            <ErrorText error={error} />
          ) : exceedsMax ? (
            <p className={styles.maxMessage}>
              This exceeds the remaining amount. Your contribution will be adjusted to {currency === 'USD' ? '$' : '₹'}{displayMaxAmount.toFixed(2)}.
            </p>
          ) : null}
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