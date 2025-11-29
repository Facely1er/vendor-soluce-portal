import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import RiskBadge from '../RiskBadge';

describe('RiskBadge Component', () => {
  it('renders Low risk badge', () => {
    render(<RiskBadge level="Low" />);

    expect(screen.getByText(/Low/i)).toBeInTheDocument();
    expect(screen.getByText(/✓/i)).toBeInTheDocument();
  });

  it('renders Medium risk badge', () => {
    render(<RiskBadge level="Medium" />);

    expect(screen.getByText(/Medium/i)).toBeInTheDocument();
    expect(screen.getByText(/!/i)).toBeInTheDocument();
  });

  it('renders High risk badge', () => {
    render(<RiskBadge level="High" />);

    expect(screen.getByText(/High/i)).toBeInTheDocument();
    expect(screen.getByText(/!!/i)).toBeInTheDocument();
  });

  it('renders Critical risk badge', () => {
    render(<RiskBadge level="Critical" />);

    expect(screen.getByText(/Critical/i)).toBeInTheDocument();
    expect(screen.getByText(/!!!/i)).toBeInTheDocument();
  });

  it('applies correct classes for Low risk', () => {
    render(<RiskBadge level="Low" />);

    const badge = screen.getByText(/Low/i).closest('span');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('applies correct classes for Medium risk', () => {
    render(<RiskBadge level="Medium" />);

    const badge = screen.getByText(/Medium/i).closest('span');
    expect(badge).toHaveClass('bg-yellow-100');
  });

  it('applies correct classes for High risk', () => {
    render(<RiskBadge level="High" />);

    const badge = screen.getByText(/High/i).closest('span');
    expect(badge).toHaveClass('bg-orange-100');
  });

  it('applies correct classes for Critical risk', () => {
    render(<RiskBadge level="Critical" />);

    const badge = screen.getByText(/Critical/i).closest('span');
    expect(badge).toHaveClass('bg-red-100');
  });

  it('applies custom className', () => {
    const { container } = render(<RiskBadge level="Low" className="custom-class" />);

    const badge = container.querySelector('.custom-class');
    expect(badge).toBeInTheDocument();
  });

  it('renders all risk levels', () => {
    const levels = ['Low', 'Medium', 'High', 'Critical'];
    
    levels.forEach(level => {
      render(<RiskBadge level={level as any} />);
      expect(screen.getByText(new RegExp(level, 'i'))).toBeInTheDocument();
    });
  });

  it('displays correct icon for each level', () => {
    const iconTests = [
      { level: 'Low', icon: '✓' },
      { level: 'Medium', icon: '!' },
      { level: 'High', icon: '!!' },
      { level: 'Critical', icon: '!!!' },
    ];

    iconTests.forEach(({ level, icon }) => {
      const { container } = render(<RiskBadge level={level as any} />);
      expect(container.textContent).toContain(icon);
    });
  });
});

