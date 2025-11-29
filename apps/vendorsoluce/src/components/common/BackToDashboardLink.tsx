import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BackToDashboardLinkProps {
  className?: string;
  showIcon?: boolean;
}

const BackToDashboardLink: React.FC<BackToDashboardLinkProps> = ({ 
  className = 'mb-6'
}) => {
  const { isAuthenticated } = useAuth();
  
  const destination = isAuthenticated ? '/dashboard' : '/';
  const label = isAuthenticated ? 'Back to Dashboard' : 'Back to Home';
  
  return (
    <div className={className}>
      <Link 
        to={destination}
        className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-vendorsoluce-navy dark:hover:text-vendorsoluce-blue transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </div>
  );
};

export default BackToDashboardLink;