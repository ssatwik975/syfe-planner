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
import { validateAmount, validateDate, getConversionRate, convertCurrency } from '../../utils';
import styles from './AddContribution.module.css';

interface AddContributionProps {
  goalId: string;
  goalName: string;
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_NOTE_LENGTH = 100; // Character limit for notes
const MAX_AMOUNT_DIGITS = 10; // Maximum digits for amount input

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
  const [contributionDate, setContributionDate] = useState<string>(new Date().toISOString().split('T')[0]);
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
    
    // Get the parts before and after decimal
    const parts = value.split('.');
    const beforeDecimal = parts[0] || '';
    
    // Check if the digits before decimal exceed the limit
    if (beforeDecimal.length > MAX_AMOUNT_DIGITS) {
      return; // Don't update if exceeds digit limit
    }
    
    if (decimalPoint <= 1) {
      setAmount(value);
      
      // Clear error when user types
      if (error) {
        setError(null);
      }
    }
  };
  
  
  // Handle currency change - convert existing amount to new currency
  const handleCurrencyChange = (newCurrency: Currency) => {
    if (amount && newCurrency !== currency) {
      // Convert the current amount to the new currency
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount)) {
        // Use utility function for conversion
        const convertedAmount = convertCurrency(parsedAmount, currency, newCurrency, exchangeRates).toFixed(2);
        
        // Update the amount
        setAmount(convertedAmount);
      }
    }
    
    // Update currency
    setCurrency(newCurrency);
  };
  
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContributionDate(e.target.value);
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
    // Validate amount using utility function
    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      return { isValid: false, error: amountValidation.error };
    }
    
    // Validate date using utility function
    const dateValidation = validateDate(contributionDate);
    if (!dateValidation.isValid) {
      return { isValid: false, error: dateValidation.error };
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

    // Create date string with time set to noon (to avoid timezone issues)
    const dateWithTime = new Date(contributionDate);
    dateWithTime.setHours(12, 0, 0, 0);
    
    // Submit with a slight delay to show loading state
    setTimeout(() => {
      addContribution({
        goalId,
        amount: finalAmount,
        note: note.trim() || undefined,
        date: dateWithTime.toISOString() // Use the selected date
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
      setContributionDate(new Date().toISOString().split('T')[0]); // Reset to today

      // Focus on amount input when modal opens
      setTimeout(() => amountInputRef.current?.focus(), 100);
    }
  }, [isOpen, goalCurrency]);
  
  // Get conversion rate info for display
  const conversionRate = getConversionRate(currency, goalCurrency, exchangeRates);
  
  
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
              className={error && error.includes('amount') ? styles.inputError : ''}
              disabled={isSubmitting}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <span className={styles.currencyIndicator}>{currency}</span>
          </InputWrapper>
          {error && error.includes('amount') ? (
            <ErrorText error={error} />
          ) : null}
        </FormGroup>
        
        {/* Date Input */}
        <FormGroup>
          <Label htmlFor="contributionDate">Date</Label>
          <InputWrapper>
            <input
              type="date"
              id="contributionDate"
              name={`contributionDate-${Math.random()}`}
              value={contributionDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              className={error && error.includes('date') ? styles.inputError : ''}
              disabled={isSubmitting}
            />
          </InputWrapper>
          {error && error.includes('date') && (
            <ErrorText error={error} />
          )}
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