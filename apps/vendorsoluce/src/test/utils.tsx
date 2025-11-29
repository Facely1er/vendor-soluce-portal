/**
 * Test utilities and helpers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

interface ProvidersProps {
  children: React.ReactNode;
}

// Wrap components with all necessary providers
const AllTheProviders: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockVendor = (overrides = {}) => ({
  id: 'test-vendor-id',
  name: 'Test Vendor',
  risk_score: 75,
  compliance_status: 'compliant',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockAssessment = (overrides = {}) => ({
  id: 'test-assessment-id',
  vendor_id: 'test-vendor-id',
  framework: 'NIST SP 800-161',
  status: 'completed',
  score: 85,
  created_at: new Date().toISOString(),
  ...overrides,
});

// Wait utilities
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));

// Mock API responses
export const mockApiResponse = (data: any, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, error: null });
    }, delay);
  });
};

export const mockApiError = (message: string, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: null, error: { message } });
    }, delay);
  });
};