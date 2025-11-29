/**
 * Production monitoring and logging utilities
 */

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp: number;
  userAgent?: string;
  url?: string;
  userId?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;

  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    data?: any
  ): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId()
    };
  }

  private getCurrentUserId(): string | undefined {
    // Get user ID from auth context or localStorage
    try {
      const userStr = localStorage.getItem('sb-auth-token');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user?.user?.id;
      }
    } catch {
      // Ignore parsing errors
    }
    return undefined;
  }

  private sendToMonitoring(entry: LogEntry) {
    if (this.isProduction) {
      // Send to external monitoring service
      // Example: Sentry, LogRocket, DataDog, etc.
      
      // For now, we'll use console in development only
      // In a real production app, replace this with your monitoring service
      if (this.isDevelopment) {
        console.log('Monitoring:', entry);
      }
      
      // Example integration:
      // if (window.gtag) {
      //   window.gtag('event', 'error', {
      //     event_category: 'javascript_error',
      //     event_label: entry.message,
      //     value: 1
      //   });
      // }
    }
  }

  info(message: string, data?: any) {
    const entry = this.createLogEntry('info', message, data);
    if (this.isDevelopment) {
      console.log(`[INFO] ${message}`, data);
    }
    this.sendToMonitoring(entry);
  }

  warn(message: string, data?: any) {
    const entry = this.createLogEntry('warn', message, data);
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, data);
    }
    this.sendToMonitoring(entry);
  }

  error(message: string, data?: any) {
    const entry = this.createLogEntry('error', message, data);
    console.error(`[ERROR] ${message}`, data);
    this.sendToMonitoring(entry);
  }

  debug(message: string, data?: any) {
    // const entry = this.createLogEntry('debug', message, data); // Not sent to monitoring for debug logs
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
}

export const logger = new Logger();

// Development-only console wrapper (safe for production)
// This will only log in development mode
export const devConsole = {
  log: (message?: any, ...optionalParams: any[]) => {
    if (import.meta.env.DEV) {
      console.log(message, ...optionalParams);
    }
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(message, ...optionalParams);
    }
  },
  error: (message?: any, ...optionalParams: any[]) => {
    // Always log errors, even in production
    console.error(message, ...optionalParams);
  },
  debug: (message?: any, ...optionalParams: any[]) => {
    if (import.meta.env.DEV) {
      console.debug(message, ...optionalParams);
    }
  },
  info: (message?: any, ...optionalParams: any[]) => {
    if (import.meta.env.DEV) {
      console.info(message, ...optionalParams);
    }
  }
};

// Error tracking for unhandled errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.error('Unhandled JavaScript error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled Promise rejection', {
      reason: event.reason,
      promise: event.promise
    });
  });
}

// Performance monitoring
export const trackUserAction = (action: string, data?: any) => {
  logger.info(`User action: ${action}`, data);
  
  // Track in analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: 'user_interaction',
      ...data
    });
  }
};

// API call monitoring
export const trackApiCall = (endpoint: string, method: string, duration: number, success: boolean) => {
  const entry = {
    endpoint,
    method,
    duration,
    success,
    timestamp: Date.now()
  };

  if (success) {
    logger.info(`API call completed: ${method} ${endpoint}`, entry);
  } else {
    logger.warn(`API call failed: ${method} ${endpoint}`, entry);
  }
};

// Performance tracking
export const trackPerformance = async <T>(
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    
    logger.info(`Performance: ${operationName}`, {
      operation: operationName,
      duration,
      success: true
    });
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    logger.error(`Performance: ${operationName} failed`, {
      operation: operationName,
      duration,
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
    
    throw error;
  }
};