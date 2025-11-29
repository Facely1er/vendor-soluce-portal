import { useEffect, useRef, useCallback } from 'react';
import { addBreadcrumb, reportError } from '../utils/sentry';
import { trackPerformance } from '../utils/monitoring';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
}

export const usePerformanceMonitoring = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const renderStartTime = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionTime: 0,
  });

  // Track component mount
  useEffect(() => {
    const loadTime = Date.now() - startTime.current;
    metrics.current.loadTime = loadTime;
    
    addBreadcrumb({
      message: `Component ${componentName} mounted`,
      category: 'performance',
      level: 'info'
    });
    
    // Report performance metrics
    if (loadTime > 1000) { // Report slow components
      reportError(new Error(`Slow component load: ${componentName}`), {
        loadTime,
        component: componentName,
        type: 'performance',
      });
    }
  }, [componentName]);

  // Track render performance
  const trackRender = useCallback((renderFn: () => void) => {
    renderStartTime.current = performance.now();
    renderFn();
    const renderTime = performance.now() - renderStartTime.current;
    metrics.current.renderTime = renderTime;
    
    if (renderTime > 16) { // Report slow renders (>16ms)
      addBreadcrumb(`Slow render: ${componentName}`, 'performance', 'warning');
    }
  }, [componentName]);

  // Track user interactions
  const trackInteraction = useCallback((interactionName: string, fn: () => void) => {
    const startTime = performance.now();
    fn();
    const interactionTime = performance.now() - startTime;
    metrics.current.interactionTime = interactionTime;
    
    addBreadcrumb(`User interaction: ${interactionName}`, 'user', 'info');
    
    if (interactionTime > 100) { // Report slow interactions
      reportError(new Error(`Slow interaction: ${interactionName}`), {
        interactionTime,
        interaction: interactionName,
        component: componentName,
        type: 'performance',
      });
    }
  }, [componentName]);

  // Track async operations
  const trackAsyncOperation = useCallback(async <T>(
    operationName: string, 
    operation: () => Promise<T>
  ): Promise<T> => {
    return trackPerformance(`${componentName}:${operationName}`, operation);
  }, [componentName]);

  // Track errors
  const trackError = useCallback((error: Error, context?: Record<string, unknown>) => {
    reportError(error, {
      component: componentName,
      ...context,
    });
  }, [componentName]);

  return {
    metrics: metrics.current,
    trackRender,
    trackInteraction,
    trackAsyncOperation,
    trackError,
  };
};

// Hook for tracking page performance
export const usePagePerformance = (pageName: string) => {
  const startTime = useRef<number>(Date.now());
  const navigationStart = useRef<number>(performance.timing?.navigationStart || 0);

  useEffect(() => {
    const pageLoadTime = Date.now() - startTime.current;
    const totalLoadTime = Date.now() - navigationStart.current;
    
    addBreadcrumb(`Page ${pageName} loaded`, 'navigation', 'info');
    
    // Report page performance
    if (totalLoadTime > 3000) { // Report slow pages
      reportError(new Error(`Slow page load: ${pageName}`), {
        pageLoadTime,
        totalLoadTime,
        page: pageName,
        type: 'performance',
      });
    }
  }, [pageName]);

  return {
    trackPageLoad: useCallback(() => {
      addBreadcrumb(`Page ${pageName} load completed`, 'navigation', 'info');
    }, [pageName]),
  };
};

// Hook for tracking API calls
export const useApiPerformance = () => {
  const trackApiCall = useCallback(async <T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      addBreadcrumb(`API call: ${endpoint}`, 'api', 'info');
      
      if (duration > 5000) { // Report slow API calls
        reportError(new Error(`Slow API call: ${endpoint}`), {
          duration,
          endpoint,
          type: 'performance',
        });
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      reportError(error as Error, {
        duration,
        endpoint,
        type: 'api_error',
      });
      
      throw error;
    }
  }, []);

  return { trackApiCall };
};