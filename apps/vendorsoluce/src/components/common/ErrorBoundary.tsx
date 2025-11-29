import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { reportError } from '../../utils/sentry';
import { logger } from '../../utils/logger';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  eventId?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo;
  eventId?: string;
  resetError: () => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report error to Sentry
    reportError(error, {
      errorInfo,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
      eventId: undefined, // Sentry event ID not available from reportError
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error using logger
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, eventId: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          errorInfo={this.state.errorInfo!}
          eventId={this.state.eventId}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  errorInfo, 
  eventId, 
  resetError 
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportBug = () => {
    const subject = encodeURIComponent('Bug Report - VendorSoluce');
    const body = encodeURIComponent(`
Error Details:
- Error: ${error.message}
- Stack: ${error.stack}
- Component Stack: ${errorInfo.componentStack}
- Event ID: ${eventId || 'N/A'}
- URL: ${window.location.href}
- User Agent: ${navigator.userAgent}
- Timestamp: ${new Date().toISOString()}

Please describe what you were doing when this error occurred:
`);
    
    window.open(`mailto:support@vendorsoluce.com?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
            </p>
            {eventId && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                Error ID: {eventId}
              </p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Error Details:</h3>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto">
              {error.message}
            </pre>
            {import.meta.env.DEV && (
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer">Stack Trace</summary>
                <pre className="text-xs text-gray-600 dark:text-gray-400 mt-2 overflow-auto">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleGoHome} className="flex-1">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            <Button variant="outline" onClick={handleReportBug} className="flex-1">
              <Bug className="h-4 w-4 mr-2" />
              Report Bug
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorBoundary;