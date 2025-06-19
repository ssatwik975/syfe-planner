import { useState, useRef, useEffect } from 'react';
import type { Currency } from '../../types/goals';
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
} from '../shared/FormUI/FormUI';
import styles from './AddContribution.module.css';

interface AddContributionProps {
  goalId: string;
  goalName: string;
  currency: Currency;
  maxAmount: number;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_NOTE_LENGTH = 100; // Character limit for notes

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
      checkIfExceedsMax(value, currency);
      
      // Clear error when user types
      if (error) {
        setError(null);
      }
    }
  };
  
  // Check if amount exceeds max allowed
  const checkIfExceedsMax = (amountValue: string, currentCurrency: Currency) => {
    const parsedAmount = parseFloat(amountValue);
    
    if (!isNaN(parsedAmount)) {
      // Calculate max contribution in current currency
      let maxAllowedAmount = maxAmount;
      if (currentCurrency !== goalCurrency) {
        // Convert max amount to the contribution currency
        const conversionRate = 
          currentCurrency === 'USD' && goalCurrency === 'INR' 
            ? exchangeRates.INR_USD  // INR -> USD
            : exchangeRates.USD_INR; // USD -> INR
        maxAllowedAmount = maxAmount * conversionRate;
      }
      
      setExceedsMax(parsedAmount > maxAllowedAmount);
    } else {
      setExceedsMax(false);
    }
  };
  
  // Handle currency change - convert existing amount to new currency
  const handleCurrencyChange = (newCurrency: Currency) => {
    if (amount && newCurrency !== currency) {
      // Convert the current amount to the new currency
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount)) {
        const conversionRate = 
          currency === 'USD' && newCurrency === 'INR' 
            ? exchangeRates.USD_INR 
            : exchangeRates.INR_USD;
        
        // Convert and format to 2 decimal places
        const convertedAmount = (parsedAmount * conversionRate).toFixed(2);
        
        // Update the amount
        setAmount(convertedAmount);
        
        // Check if the new amount exceeds max in the new currency
        checkIfExceedsMax(convertedAmount, newCurrency);
      }
    }
    
    // Update currency
    setCurrency(newCurrency);
  };
  
  // Handle note change with character limit
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_NOTE_LENGTH) {
      setNote(value);
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
  
  // Create a randomized form name to prevent autofill grouping
  const formName = `contribution-form-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add Contribution" 
      icon={contributionIcon}
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.form} name={formName} autoComplete="off">
        <div className={styles.goalNameContainer}>
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
              name={`contributionAmount-${Math.random()}`}
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={error ? styles.inputError : exceedsMax ? styles.inputWarning : ''}
              disabled={isSubmitting}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
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
            setCurrency={handleCurrencyChange}
            disabled={isSubmitting}
            label="Contribution Currency"
          />
          <ConversionInfo 
            sourceCurrency={currency}
            targetCurrency={goalCurrency}
            conversionRate={conversionRate}
          />
        </FormGroup>
        
        {/* Note Field with Character Limit */}
        <FormGroup>
          <Label htmlFor="contributionNote">
            Note <span className={styles.optionalLabel}>(optional)</span>
          </Label>
          <InputWrapper>
            <textarea
              id="contributionNote"
              name={`contributionNote-${Math.random()}`}
              value={note}
              onChange={handleNoteChange}
              placeholder="e.g. Birthday money, Bonus"
              rows={2}
              maxLength={MAX_NOTE_LENGTH}
              className={styles.noteTextarea}
              disabled={isSubmitting}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {note && (
              <span className={styles.characterCount}>{note.length}/{MAX_NOTE_LENGTH}</span>
            )}
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