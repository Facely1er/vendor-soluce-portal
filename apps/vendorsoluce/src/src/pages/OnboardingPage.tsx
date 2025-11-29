import React, { useState } from 'react';
import WelcomeScreen from '../components/onboarding/WelcomeScreen';

const OnboardingPage: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleOnboardingComplete = () => {
    setShowWelcome(false);
    // The markOnboardingComplete function will handle navigation
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showWelcome && (
        <WelcomeScreen onComplete={handleOnboardingComplete} />
      )}
    </div>
  );
};

export default OnboardingPage;