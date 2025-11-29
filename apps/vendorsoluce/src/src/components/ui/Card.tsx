import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'assessment' | 'sbom' | 'vendor';
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 overflow-hidden';
  
  const variantClasses = {
    default: 'border border-gray-200 dark:border-gray-700',
    assessment: 'border border-gray-200 dark:border-gray-700 border-l-4 border-l-vendorsoluce-navy hover:shadow-lg hover:-translate-y-1',
    sbom: 'border border-gray-200 dark:border-gray-700 border-l-4 border-l-vendorsoluce-teal hover:shadow-lg hover:-translate-y-1',
    vendor: 'border border-gray-200 dark:border-gray-700 border-l-4 border-l-vendorsoluce-blue hover:shadow-lg hover:-translate-y-1',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = '',
}) => {
  return (
    <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-4 pt-0 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
export default Card;