/**
 * Production-safe logger utility
 * Replaces console.log statements with environment-aware logging
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

class ProductionLogger {
  private shouldLog(level: string): boolean {
    // In production, only log warnings and errors
    if (isProduction) {
      return level === 'warn' || level === 'error';
    }
    // In development, log everything
    return true;
  }

  log(...args: any[]): void {
    if (this.shouldLog('log') && isDevelopment) {
      console.log(...args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog('info') && isDevelopment) {
      console.info(...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(...args);
    }
  }

  debug(...args: any[]): void {
    if (this.shouldLog('debug') && isDevelopment) {
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