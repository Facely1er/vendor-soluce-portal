import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS, EVENTS } from 'react-joyride';
// import { useAuth } from '../../context/AuthContext';
// import { useLocation } from 'react-router-dom';

interface AppTourProps {
  isRunning: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const AppTour: React.FC<AppTourProps> = ({ isRunning, onComplete, onSkip }) => {
  // const { } = useAuth();
  // const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);
  const [run, setRun] = useState(false);

  // Tour steps configuration
  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Welcome to VendorSoluce!</h3>
          <p>Let's take a quick tour of the key features to help you get started with supply chain risk management.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="main-nav"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Navigation Menu</h3>
          <p>Use this menu to navigate between different sections of VendorSoluce. Access assessments, vendor management, SBOM analysis, and resources.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="user-menu"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">User Profile</h3>
          <p>Access your profile settings, account preferences, and sign out from here.</p>
        </div>
      ),
      placement: 'bottom-end',
    },
    {
      target: '[data-tour="theme-toggle"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Theme Toggle</h3>
          <p>Switch between light and dark themes to customize your viewing experience.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="get-started-widget"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Get Started Guide</h3>
          <p>This widget shows your progress through essential setup steps. Complete these to get the most out of VendorSoluce.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="add-vendor"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Add Your First Vendor</h3>
          <p>Start building your vendor risk portfolio by clicking here to add your first vendor. You can assess their security posture and track compliance.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="run-assessment"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Supply Chain Assessment</h3>
          <p>Evaluate your organization's supply chain security posture with our NIST SP 800-161 aligned assessment tool.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="analyze-sbom"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">SBOM Analysis</h3>
          <p>Upload and analyze Software Bill of Materials files to identify vulnerabilities and compliance issues in your software components.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '[data-tour="quick-actions"]',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
          <p>Access frequently used features quickly from this section. Add vendors, run assessments, analyze SBOMs, and generate reports.</p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: 'body',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">Tour Complete!</h3>
          <p>You're all set! Start by adding your first vendor or running a supply chain assessment. You can always access help and documentation from the resources menu.</p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> You can retake this tour anytime from your profile menu.
            </p>
          </div>
        </div>
      ),
      placement: 'center',
    },
  ];

  useEffect(() => {
    setRun(isRunning);
  }, [isRunning]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      setRun(false);
      if (status === STATUS.FINISHED) {
        onComplete();
      } else {
        onSkip();
      }
    } else if (type === EVENTS.STEP_AFTER) {
      setStepIndex(index + 1);
    }
  };

  // Custom styles for the tour
  const joyrideStyles = {
    options: {
      primaryColor: '#33691E', // VendorSoluce green
      backgroundColor: '#ffffff',
      textColor: '#333333',
      overlayColor: 'rgba(0, 0, 0, 0.4)',
      spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
      beaconSize: 36,
      zIndex: 1000,
    },
    tooltip: {
      fontSize: '14px',
      padding: '20px',
    },
    tooltipContainer: {
      textAlign: 'left' as const,
    },
    buttonNext: {
      backgroundColor: '#33691E',
      fontSize: '14px',
      padding: '8px 16px',
      borderRadius: '6px',
    },
    buttonBack: {
      color: '#666',
      fontSize: '14px',
      marginRight: '10px',
    },
    buttonSkip: {
      color: '#999',
      fontSize: '14px',
    },
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      stepIndex={stepIndex}
      styles={joyrideStyles}
      locale={{
        back: 'Previous',
        close: 'Close',
        last: 'Complete Tour',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
};

export default AppTour;