import { render, screen} from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { I18nProvider } from '../../context/I18nContext';
import { useApi } from '../../hooks/useApi';
import UserManagementPage from '../../pages/UserManagementPage';

// Mock the useApi hook
vi.mock('../../hooks/useApi');
const mockUseApi = vi.mocked(useApi);

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

describe('UserManagementPage', () => {
  const mockUsers = [
    {
      id: '1',
      email: 'admin@example.com',
      full_name: 'Admin User',
      role: 'admin',
      status: 'active',
      last_login: '2025-01-01T00:00:00Z',
      created_at: '2024-12-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'user@example.com',
      full_name: 'Regular User',
      role: 'user',
      status: 'inactive',
      last_login: null,
      created_at: '2024-12-15T00:00:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      activateUser: vi.fn(),
      deactivateUser: vi.fn(),
      refetch: vi.fn(),
    });
  });

  it('renders user management page correctly', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Manage user accounts and permissions')).toBeInTheDocument();
  });

  it('displays user list', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('Regular User')).toBeInTheDocument();
  });

  it('shows user roles', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('displays user status', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('shows last login information', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
    expect(screen.getByText('Never')).toBeInTheDocument();
  });

  it('displays user creation dates', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText(/2024-12-01/)).toBeInTheDocument();
    expect(screen.getByText(/2024-12-15/)).toBeInTheDocument();
  });

  it('shows user management actions', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Add User')).toBeInTheDocument();
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    expect(screen.getByText('Delete User')).toBeInTheDocument();
  });

  it('displays user activation controls', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Activate User')).toBeInTheDocument();
    expect(screen.getByText('Deactivate User')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    mockUseApi.mockReturnValue({
      users: [],
      loading: true,
      error: null,
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      activateUser: vi.fn(),
      deactivateUser: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows error state', () => {
    mockUseApi.mockReturnValue({
      users: [],
      loading: false,
      error: 'Failed to load users',
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      activateUser: vi.fn(),
      deactivateUser: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load users')).toBeInTheDocument();
  });

  it('handles empty users list', () => {
    mockUseApi.mockReturnValue({
      users: [],
      loading: false,
      error: null,
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
      activateUser: vi.fn(),
      deactivateUser: vi.fn(),
      refetch: vi.fn(),
    });

    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText(/no users found/i)).toBeInTheDocument();
  });

  it('displays user search functionality', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Search Users')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search users/i)).toBeInTheDocument();
  });

  it('shows user filters', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Filter by Role')).toBeInTheDocument();
    expect(screen.getByText('Filter by Status')).toBeInTheDocument();
  });

  it('displays user statistics', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('User Statistics')).toBeInTheDocument();
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows role management', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Role Management')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('displays permission settings', () => {
    render(
      <TestWrapper>
        <UserManagementPage />
      </TestWrapper>
    );

    expect(screen.getByText('Permissions')).toBeInTheDocument();
    expect(screen.getByText('Manage Vendors')).toBeInTheDocument();
    expect(screen.getByText('View Reports')).toBeInTheDocument();
  });
});

