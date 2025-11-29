import React from 'react';
import SBOMAnalyzer from './SBOMAnalyzer';

// This is a wrapper component that provides the same functionality
// as SBOMAnalyzer but with the expected name for the routing
const SBOMAnalysisPage: React.FC = () => {
  return <SBOMAnalyzer />;
};

export default SBOMAnalysisPage;