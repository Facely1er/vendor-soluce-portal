import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  title,
  ...props
}, ref) => {
  const baseClasses = 'font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-vendorsoluce-green text-white hover:bg-vendorsoluce-dark-green focus:ring-vendorsoluce-green/50 dark:bg-vendorsoluce-green dark:hover:bg-vendorsoluce-dark-green',
    secondary: 'bg-white text-vendorsoluce-green hover:bg-gray-100 focus:ring-vendorsoluce-green/30 border border-white dark:bg-gray-800 dark:text-vendorsoluce-light-green dark:hover:bg-gray-700 dark:border-gray-700',
    outline: 'bg-transparent border border-vendorsoluce-green text-vendorsoluce-green hover:bg-vendorsoluce-pale-green focus:ring-vendorsoluce-green/30 dark:border-vendorsoluce-light-green dark:text-vendorsoluce-light-green dark:hover:bg-vendorsoluce-green/20',
    ghost: 'bg-transparent text-vendorsoluce-green hover:bg-vendorsoluce-pale-green focus:ring-vendorsoluce-green/30 dark:text-vendorsoluce-light-green dark:hover:bg-vendorsoluce-green/20',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      ref={ref}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
export default Button;