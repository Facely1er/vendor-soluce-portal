/**
 * Production-safe logger utility
 * Replaces console.log statements with environment-aware logging
 */

// Type declaration for Vite environment variables
declare global {
  interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly PROD: boolean;
    readonly VITE_DEBUG_MODE?: string;
    readonly VITE_ENABLE_ERROR_REPORTING?: string;
    [key: string]: any;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
const enableErrorReporting = import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true';

class ProductionLogger {
  private shouldLog(level: string): boolean {
    // In production, only log warnings and errors (or if debug/error reporting enabled)
    if (isProduction) {
      if (debugMode || enableErrorReporting) {
        return true;
      }
      return level === 'warn' || level === 'error';
    }
    // In development, log everything
    return true;
  }

  log(...args: any[]): void {
    if (this.shouldLog('log') && (isDevelopment || debugMode)) {
      console.log(...args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info') && (isDevelopment || debugMode)) {
      console.info(...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
    // In production, could send to error tracking service
    if (isProduction && enableErrorReporting) {
      // TODO: Send to Sentry or other error tracking service
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...args);
    }
    // In production, send to error tracking service
    if (isProduction && enableErrorReporting) {
      // TODO: Send to Sentry or other error tracking service
    }
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug') && (isDevelopment || debugMode)) {
      console.debug(...args);
    }
  }

  table(data: any): void {
    if (this.shouldLog('log') && isDevelopment) {
      console.table(data);
    }
  }

  time(label: string): void {
    if (this.shouldLog('log') && isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog('log') && isDevelopment) {
      console.timeEnd(label);
    }
  }

  group(label: string): void {
    if (this.shouldLog('log') && isDevelopment) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.shouldLog('log') && isDevelopment) {
      console.groupEnd();
    }
  }
}

// Export singleton instance
export const logger = new ProductionLogger();

// Default export for convenience
export default logger;