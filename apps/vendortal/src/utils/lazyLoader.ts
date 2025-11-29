import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Robust lazy loader with retry mechanism for dynamic imports
 * Handles failures on Vercel and other hosting platforms where
 * dynamic imports may fail due to network issues or build hash mismatches
 */
export function lazyWithRetry<T extends ComponentType<Record<string, unknown>>>(
  importFn: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): LazyExoticComponent<T> {
  return lazy(async () => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const module = await importFn();
        return module;
      } catch (error) {
        lastError = error as Error;
        
        // Only log in development to avoid console warnings in production
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn(`Lazy import attempt ${attempt + 1} failed:`, error);
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
        }
      }
    }
    
    // If all retries failed, throw the last error
    throw new Error(
      `Failed to load module after ${retries} attempts: ${lastError?.message || 'Unknown error'}`
    );
  });
}

