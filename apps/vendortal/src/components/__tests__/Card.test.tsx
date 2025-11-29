import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

describe('Card Component', () => {
  it('renders Card correctly', () => {
    render(<Card>Card content</Card>);
    
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders CardHeader with title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders CardContent correctly', () => {
    render(
      <Card>
        <CardContent>
          <p>Content paragraph</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Content paragraph')).toBeInTheDocument();
  });

  it('renders multiple CardContent sections', () => {
    render(
      <Card>
        <CardContent>Section 1</CardContent>
        <CardContent>Section 2</CardContent>
      </Card>
    );
    
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });

  it('renders with all parts together', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Header Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Content here</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Header Title')).toBeInTheDocument();
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });
});

