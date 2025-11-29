import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderWithRouter = (path = '/dashboard') => {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Breadcrumbs />
    </MemoryRouter>
  );
};

describe('Breadcrumbs Component', () => {
  it('renders breadcrumbs for dashboard', () => {
    renderWithRouter('/dashboard');
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('renders Home icon', () => {
    const { container } = renderWithRouter('/dashboard');
    const homeLink = container.querySelector('a[aria-label="Home"]');
    expect(homeLink).toBeInTheDocument();
  });

  it('returns null for root path', () => {
    const { container } = renderWithRouter('/');
    expect(container.firstChild).toBeNull();
  });

  it('has proper aria-label', () => {
    renderWithRouter('/dashboard');
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});

