# VendorSoluce Developer Guide

## Table of Contents

1. [Development Setup](#development-setup)
2. [Architecture Overview](#architecture-overview)
3. [Frontend Development](#frontend-development)
4. [Backend Development](#backend-development)
5. [Database Schema](#database-schema)
6. [API Integration](#api-integration)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [Troubleshooting](#troubleshooting)

## Development Setup

### Prerequisites

- **Node.js**: Version 18+ (recommended: use nvm)
- **npm**: Version 8+ or yarn
- **Git**: Latest version
- **Supabase CLI**: For local development
- **Docker**: For local database (optional)

### Environment Setup

1. **Clone Repository**:
```bash
git clone https://github.com/vendorsoluce/vendorsoluce.git
cd vendorsoluce
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Environment Configuration**:
```bash
cp .env.example .env.local
```

Configure your `.env.local` file:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Sentry Configuration
VITE_SENTRY_DSN=your_sentry_dsn
VITE_SENTRY_ENVIRONMENT=development

# App Configuration
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=VendorSoluce
```

4. **Start Development Server**:
```bash
npm run dev
```

### Supabase Local Development

1. **Install Supabase CLI**:
```bash
npm install -g supabase
```

2. **Start Local Supabase**:
```bash
supabase start
```

3. **Run Migrations**:
```bash
supabase db reset
```

4. **Generate Types**:
```bash
supabase gen types typescript --local > src/lib/database.types.ts
```

## Architecture Overview

### Technology Stack

**Frontend**:
- **React 18**: UI framework with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Query**: Server state management
- **Zustand**: Client state management

**Backend**:
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Primary database
- **Edge Functions**: Serverless functions (Deno)
- **Row Level Security**: Database security
- **Real-time**: WebSocket subscriptions

**External Services**:
- **Stripe**: Payment processing
- **Sentry**: Error tracking and monitoring
- **Vercel Analytics**: Usage analytics

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Button, Card, etc.)
│   ├── ui/            # Base UI components
│   ├── charts/        # Chart components
│   ├── dashboard/     # Dashboard-specific components
│   └── ...
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── context/           # React context providers
├── lib/               # Utility libraries
├── services/          # External service integrations
├── stores/            # State management stores
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── test/              # Test files
└── locales/           # Internationalization files
```

## Frontend Development

### Component Development

#### Creating a New Component

```typescript
// src/components/example/ExampleComponent.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface ExampleComponentProps {
  title: string;
  onAction: () => void;
  children?: React.ReactNode;
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  onAction,
  children,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
        <Button onClick={onAction}>
          Action
        </Button>
      </CardContent>
    </Card>
  );
};
```

#### Styling Guidelines

Use TailwindCSS classes for styling:

```typescript
// Good: Utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// Avoid: Custom CSS unless necessary
<div className="custom-styling">
```

#### State Management

Use appropriate state management patterns:

```typescript
// Local state
const [isLoading, setIsLoading] = useState(false);

// Global state (Zustand)
const { vendors, addVendor } = useVendorStore();

// Server state (React Query)
const { data: vendors, isLoading } = useQuery({
  queryKey: ['vendors'],
  queryFn: fetchVendors,
});
```

### Custom Hooks

#### Creating Custom Hooks

```typescript
// src/hooks/useVendorData.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Vendor } from '../types';

export const useVendorData = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVendors(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return { vendors, isLoading, error };
};
```

### Error Handling

#### Error Boundaries

```typescript
// src/components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reportError } from '../utils/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportError(error, { errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Backend Development

### Supabase Edge Functions

#### Creating Edge Functions

```typescript
// supabase/functions/example-function/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const { method } = req;
    
    if (method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { data, error } = await supabase
      .from('vendors')
      .select('*');

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
```

#### Database Functions

```sql
-- supabase/migrations/create_vendor_stats_function.sql
CREATE OR REPLACE FUNCTION get_vendor_stats()
RETURNS TABLE (
  total_vendors bigint,
  high_risk_vendors bigint,
  compliant_vendors bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_vendors,
    COUNT(*) FILTER (WHERE risk_level = 'high' OR risk_level = 'critical') as high_risk_vendors,
    COUNT(*) FILTER (WHERE compliance_status = 'compliant') as compliant_vendors
  FROM vendors;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Row Level Security (RLS)

```sql
-- Enable RLS on vendors table
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see vendors from their organization
CREATE POLICY "Users can view vendors from their organization" ON vendors
  FOR SELECT USING (
    organization_id = (
      SELECT organization_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert vendors for their organization
CREATE POLICY "Users can insert vendors for their organization" ON vendors
  FOR INSERT WITH CHECK (
    organization_id = (
      SELECT organization_id 
      FROM profiles 
      WHERE id = auth.uid()
    )
  );
```

## Database Schema

### Core Tables

#### Vendors Table
```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  website TEXT,
  industry TEXT,
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  compliance_status TEXT CHECK (compliance_status IN ('compliant', 'non-compliant', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### SBOM Analyses Table
```sql
CREATE TABLE sbom_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  analysis_status TEXT CHECK (analysis_status IN ('pending', 'processing', 'completed', 'failed')),
  vulnerabilities_found INTEGER DEFAULT 0,
  critical_vulnerabilities INTEGER DEFAULT 0,
  high_vulnerabilities INTEGER DEFAULT 0,
  medium_vulnerabilities INTEGER DEFAULT 0,
  low_vulnerabilities INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Database Migrations

#### Creating Migrations

```bash
# Create a new migration
supabase migration new add_vendor_assessments

# Apply migrations
supabase db reset
```

#### Migration Example

```sql
-- supabase/migrations/20240101_add_vendor_assessments.sql
CREATE TABLE vendor_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  assessment_name TEXT NOT NULL,
  assessment_type TEXT CHECK (assessment_type IN ('security', 'compliance', 'financial', 'operational')),
  status TEXT CHECK (status IN ('draft', 'sent', 'in_progress', 'completed', 'overdue')),
  due_date DATE,
  assessor_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_vendor_assessments_vendor_id ON vendor_assessments(vendor_id);
CREATE INDEX idx_vendor_assessments_status ON vendor_assessments(status);
CREATE INDEX idx_vendor_assessments_due_date ON vendor_assessments(due_date);
```

## API Integration

### Supabase Client Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### API Service Layer

```typescript
// src/services/vendorService.ts
import { supabase } from '../lib/supabase';
import { Vendor } from '../types';

export class VendorService {
  static async getVendors(): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createVendor(vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>): Promise<Vendor> {
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendor)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor> {
    const { data, error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteVendor(id: string): Promise<void> {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
```

### Real-time Subscriptions

```typescript
// src/hooks/useVendorSubscription.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Vendor } from '../types';

export const useVendorSubscription = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchVendors = async () => {
      const { data } = await supabase
        .from('vendors')
        .select('*');
      setVendors(data || []);
    };

    fetchVendors();

    // Subscribe to changes
    const subscription = supabase
      .channel('vendors')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vendors' },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              setVendors(prev => [payload.new as Vendor, ...prev]);
              break;
            case 'UPDATE':
              setVendors(prev => 
                prev.map(vendor => 
                  vendor.id === payload.new.id ? payload.new as Vendor : vendor
                )
              );
              break;
            case 'DELETE':
              setVendors(prev => 
                prev.filter(vendor => vendor.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return vendors;
};
```

## Testing

### Unit Testing

```typescript
// src/test/services/vendorService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { VendorService } from '../../services/vendorService';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            { id: '1', name: 'Test Vendor', email: 'test@vendor.com' }
          ],
          error: null
        }))
      }))
    }))
  }
}));

describe('VendorService', () => {
  it('should fetch vendors', async () => {
    const vendors = await VendorService.getVendors();
    expect(vendors).toHaveLength(1);
    expect(vendors[0].name).toBe('Test Vendor');
  });
});
```

### Component Testing

```typescript
// src/test/components/VendorCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VendorCard } from '../../components/VendorCard';

const mockVendor = {
  id: '1',
  name: 'Test Vendor',
  email: 'test@vendor.com',
  risk_level: 'medium',
  compliance_status: 'compliant'
};

describe('VendorCard', () => {
  it('renders vendor information', () => {
    render(<VendorCard vendor={mockVendor} onEdit={vi.fn()} />);
    
    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('test@vendor.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<VendorCard vendor={mockVendor} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockVendor);
  });
});
```

### Integration Testing

```typescript
// src/test/integration/vendorFlow.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { VendorsPage } from '../../pages/VendorsPage';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Vendor Flow Integration', () => {
  it('should allow creating and viewing vendors', async () => {
    render(
      <TestWrapper>
        <VendorsPage />
      </TestWrapper>
    );

    // Click add vendor button
    fireEvent.click(screen.getByRole('button', { name: /add vendor/i }));

    // Fill form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'New Vendor' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@vendor.com' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for vendor to appear in list
    await waitFor(() => {
      expect(screen.getByText('New Vendor')).toBeInTheDocument();
    });
  });
});
```

## Deployment

### Build Process

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Build for production
npm run build

# Preview build
npm run preview
```

### Environment Configuration

#### Production Environment Variables

```env
# Production Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Production Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key

# Production Sentry
VITE_SENTRY_DSN=https://your_sentry_dsn
VITE_SENTRY_ENVIRONMENT=production

# App Configuration
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=VendorSoluce
```

### Deployment Platforms

#### Vercel Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build**: Set build command to `npm run build`
3. **Environment Variables**: Add production environment variables
4. **Deploy**: Automatic deployment on push to main branch

#### Netlify Deployment

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**: 
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add production environment variables
4. **Deploy**: Automatic deployment on push to main branch

### Database Deployment

```bash
# Deploy migrations to production
supabase db push

# Generate production types
supabase gen types typescript --project-id your-project-id > src/lib/database.types.ts
```

## Contributing

### Development Workflow

1. **Fork Repository**: Create a fork of the main repository
2. **Create Branch**: Create a feature branch from main
3. **Make Changes**: Implement your changes with tests
4. **Run Tests**: Ensure all tests pass
5. **Submit PR**: Create a pull request with detailed description

### Code Standards

- **TypeScript**: Use strict TypeScript configuration
- **ESLint**: Follow ESLint rules and fix all warnings
- **Prettier**: Use Prettier for code formatting
- **Testing**: Write tests for new features and bug fixes
- **Documentation**: Update documentation for API changes

### Pull Request Guidelines

- **Clear Description**: Describe what the PR does and why
- **Tests**: Include tests for new functionality
- **Documentation**: Update relevant documentation
- **Breaking Changes**: Clearly mark any breaking changes
- **Screenshots**: Include screenshots for UI changes

## Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run build -- --force
```

#### Type Errors

```bash
# Regenerate database types
supabase gen types typescript --local > src/lib/database.types.ts

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### Supabase Connection Issues

```bash
# Check Supabase status
supabase status

# Reset local database
supabase db reset

# Check environment variables
echo $VITE_SUPABASE_URL
```

### Debugging

#### Enable Debug Logging

```typescript
// Add to your component or hook
console.log('Debug info:', { vendors, isLoading, error });
```

#### React DevTools

Install React DevTools browser extension for component debugging.

#### Supabase Dashboard

Use the Supabase dashboard to monitor database queries and performance.

---

*This developer guide is regularly updated. For the latest version, visit our documentation site.*
