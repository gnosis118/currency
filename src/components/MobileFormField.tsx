import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MobileFormFieldProps {
  label?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel';
  inputMode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
  autoComplete?: string;
  id?: string;
  name?: string;
}

interface MobileSelectFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  name?: string;
  children?: React.ReactNode;
}

// Mobile-optimized input field
export const MobileFormField: React.FC<MobileFormFieldProps> = ({
  label,
  type = 'text',
  inputMode,
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  disabled = false,
  error,
  autoComplete = 'off',
  id,
  name,
  ...props
}) => {
  const fieldId = id || name || `field-${Math.random().toString(36).substr(2, 9)}`;

  // Determine appropriate inputMode based on type
  const getInputMode = () => {
    if (inputMode) return inputMode;
    switch (type) {
      case 'number':
        return 'decimal';
      case 'tel':
        return 'tel';
      case 'email':
        return 'email';
      default:
        return 'text';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label 
          htmlFor={fieldId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        id={fieldId}
        name={name}
        type={type}
        inputMode={getInputMode()}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={cn(
          // Mobile-optimized styling
          'min-h-12 text-base touch-manipulation',
          'focus:ring-2 focus:ring-primary focus:ring-offset-1',
          'transition-all duration-200',
          error && 'border-destructive focus:ring-destructive',
          className
        )}
        style={{
          // Prevent zoom on iOS
          fontSize: '16px',
          WebkitAppearance: 'none',
          WebkitTextSizeAdjust: '100%',
        }}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Mobile-optimized select field
export const MobileSelectField: React.FC<MobileSelectFieldProps> = ({
  label,
  placeholder = 'Select an option',
  value,
  onValueChange,
  options = [],
  required = false,
  className = '',
  disabled = false,
  error,
  id,
  name,
  children,
}) => {
  const fieldId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label 
          htmlFor={fieldId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger 
          id={fieldId}
          className={cn(
            // Mobile-optimized styling
            'min-h-12 text-base touch-manipulation',
            'focus:ring-2 focus:ring-primary focus:ring-offset-1',
            'transition-all duration-200',
            error && 'border-destructive focus:ring-destructive',
          )}
          style={{
            fontSize: '16px', // Prevent zoom on iOS
          }}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent 
          className="max-h-60 overflow-y-auto z-50"
          position="popper"
          sideOffset={4}
        >
          {children ? children : options.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
              className={cn(
                'min-h-11 touch-manipulation',
                'focus:bg-accent focus:text-accent-foreground',
                'cursor-pointer'
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Mobile-optimized form container
export const MobileForm: React.FC<{
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}> = ({ children, onSubmit, className = '' }) => {
  return (
    <form 
      onSubmit={onSubmit}
      className={cn(
        'space-y-4 md:space-y-6',
        'touch-manipulation',
        className
      )}
      noValidate // We'll handle validation ourselves
    >
      {children}
    </form>
  );
};

// Mobile-optimized button
export const MobileButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}> = ({ 
  children, 
  onClick, 
  type = 'button',
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        // Base mobile-friendly styles
        'min-h-12 px-6 py-3 rounded-lg font-medium',
        'touch-manipulation transition-all duration-200',
        'focus:ring-2 focus:ring-offset-2 focus:outline-none',
        
        // Variants
        variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
        variant === 'outline' && 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-primary',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
        variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground focus:ring-accent',
        variant === 'link' && 'text-primary underline-offset-4 hover:underline focus:ring-primary',
        
        // Sizes
        size === 'sm' && 'min-h-10 px-4 py-2 text-sm',
        size === 'lg' && 'min-h-14 px-8 py-4 text-lg',
        size === 'icon' && 'min-h-12 min-w-12 p-0',
        
        // States
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'opacity-75 cursor-wait',
        fullWidth && 'w-full',
        
        className
      )}
      style={{
        WebkitTapHighlightColor: 'transparent', // Remove iOS tap highlight
      }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          {typeof children === 'string' ? 'Loading...' : children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default MobileFormField;
