import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import Button from '../../components/ui/Button';

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  </BrowserRouter>
);

describe('Button Component', () => {
  it('renders button with children', () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    
    render(
      <TestWrapper>
        <Button onClick={handleClick}>Click me</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant styles', () => {
    render(
      <TestWrapper>
        <Button variant="primary">Primary Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Primary Button' });
    expect(button).toHaveClass('bg-vendorsoluce-green');
  });

  it('applies secondary variant styles', () => {
    render(
      <TestWrapper>
        <Button variant="secondary">Secondary Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Secondary Button' });
    expect(button).toHaveClass('bg-white');
  });

  it('applies outline variant styles', () => {
    render(
      <TestWrapper>
        <Button variant="outline">Outline Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Outline Button' });
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies ghost variant styles', () => {
    render(
      <TestWrapper>
        <Button variant="ghost">Ghost Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Ghost Button' });
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies small size styles', () => {
    render(
      <TestWrapper>
        <Button size="sm">Small Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Small Button' });
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('applies medium size styles', () => {
    render(
      <TestWrapper>
        <Button size="md">Medium Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Medium Button' });
    expect(button).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('applies large size styles', () => {
    render(
      <TestWrapper>
        <Button size="lg">Large Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Large Button' });
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('handles disabled state', () => {
    render(
      <TestWrapper>
        <Button disabled>Disabled Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(
      <TestWrapper>
        <Button className="custom-class">Custom Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Custom Button' });
    expect(button).toHaveClass('custom-class');
  });

  it('renders as submit button', () => {
    render(
      <TestWrapper>
        <Button type="submit">Submit Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button', { name: 'Submit Button' });
    expect(button).toHaveAttribute('type', 'submit');
  });
});

