import React from 'react';
import VendorRiskDashboard from './VendorRiskDashboard';

// This is a wrapper component that provides the same functionality
// as VendorRiskDashboard but with the expected name for the routing
const VendorsPage: React.FC = () => {
  return <VendorRiskDashboard />;
};

export default VendorsPage;