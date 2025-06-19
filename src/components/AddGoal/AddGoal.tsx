import { useState, useRef, useEffect } from 'react';
import type { Currency, FormErrors, GoalFormData } from '../../types/goals';
import Modal from '../shared/Modal/Modal';
import { 
  FormGroup, 
  InputWrapper, 
  Label, 
  ErrorText, 
  CurrencyToggle, 
  FormActions 
} from '../shared/FormUI/FormUI';
import styles from './AddGoal.module.css';

interface AddGoalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: GoalFormData) => void;
  existingGoalNames: string[];
}

const AddGoal = ({ isOpen, onClose, onSubmit, existingGoalNames }: AddGoalProps) => {
  // State Management
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Form Validation & Submission
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
    
    // Set submitting state
    setIsSubmitting(true);
    
    // Submit with a slight delay to show loading state
    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        amount: parseFloat(amount),
        currency
      });
      
      // Reset states
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form
      setTitle('');
      setAmount('');
      setCurrency('USD');
      setErrors({});
      setIsSubmitting(false);

      // Focus on title input when modal opens
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5V19" stroke="#4F67FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12H19" stroke="#4F67FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Add New Goal" 
      icon={addIcon}
      isSubmitting={isSubmitting}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Goal Name Field */}
        <FormGroup>
          <Label htmlFor="goalTitle">Goal Name</Label>
          <InputWrapper>
            <input
              ref={titleInputRef}
              type="text"
              id="goalTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value.substring(0, 30))} // Limit to 30 chars
              placeholder="e.g. Emergency Fund, New Laptop"
              className={errors.title ? styles.inputError : ''}
              maxLength={30}
            />
            {title && (
              <span className={styles.characterCount}>{title.length}/30</span>
            )}
          </InputWrapper>
          <ErrorText error={errors.title} />
        </FormGroup>

        {/* Amount Input */}
        <FormGroup>
          <Label htmlFor="goalAmount">Target Amount</Label>
          <div className={styles.amountInputGroup}>
            <InputWrapper>
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
            </InputWrapper>
          </div>
          <ErrorText error={errors.amount} />
        </FormGroup>
        
        {/* Currency Toggle */}
        <FormGroup>
          <CurrencyToggle 
            currency={currency}
            setCurrency={setCurrency}
            disabled={isSubmitting}
          />
        </FormGroup>

        {/* Form Actions */}
        <FormActions
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitText="Add Goal"
        />
      </form>
    </Modal>
  );
};

export default AddGoal;