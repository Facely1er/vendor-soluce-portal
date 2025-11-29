import React, { useEffect } from 'react';
import { usePerformanceMonitoring, usePagePerformance } from '../../hooks/usePerformanceMonitoring';
import { addBreadcrumb } from '../../utils/sentry';

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  componentName, 
  children 
}) => {
  const { trackRender, trackInteraction, trackAsyncOperation, trackError } = usePerformanceMonitoring(componentName);
  const { trackPageLoad } = usePagePerformance(componentName);

  useEffect(() => {
    addBreadcrumb(`Component ${componentName} mounted`, 'component', 'info');
    
    return () => {
      addBreadcrumb(`Component ${componentName} unmounted`, 'component', 'info');
    };
  }, [componentName]);

  // Track page load performance
  useEffect(() => {
    const loadTime = performance.now();
    trackPageLoad(loadTime);
  }, [trackPageLoad]);

  // Wrap children with performance tracking
  const wrappedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        onRender: () => trackRender(() => {}),
        onInteraction: (name: string, fn: () => void) => trackInteraction(name, fn),
        onAsyncOperation: (name: string, fn: () => Promise<unknown>) => trackAsyncOperation(name, fn),
        onError: (error: Error, context?: Record<string, unknown>) => trackError(error, context),
      });
    }
    return child;
  });

  return <>{wrappedChildren}</>;
};

export default PerformanceMonitor;

