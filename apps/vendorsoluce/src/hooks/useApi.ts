import { useState, useCallback } from 'react';
import { logger, trackApiCall } from '../utils/monitoring';
import { defaultRateLimiter } from '../utils/security';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData | string;
  timeout?: number;
  retries?: number;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for making API calls with built-in error handling, retries, and rate limiting
 * 
 * @template T - The type of data expected from the API response
 * @returns Object containing API state (data, loading, error) and call function
 * 
 * @example
 * ```typescript
 * const { data, loading, error, call } = useApi<User>();
 * await call('/api/users', { method: 'GET' });
 * ```
 */
export const useApi = <T = unknown>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  /**
   * Make an API call with automatic retries and error handling
   * 
   * @param url - The API endpoint URL
   * @param options - API call options (method, headers, body, timeout, retries)
   * @returns Promise resolving to the response data or null on error
   * @throws Error if all retry attempts fail
   */
  const call = useCallback(async (
    url: string, 
    options: ApiOptions = {}
  ): Promise<T | null> => {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000,
      retries = 3
    } = options;

    // Rate limiting check
    if (!defaultRateLimiter.isAllowed(url)) {
      const error = 'Rate limit exceeded. Please try again later.';
      setState(prev => ({ ...prev, error, loading: false }));
      throw new Error(error);
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    const startTime = Date.now();

    // let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch {
            // If response is not JSON, use user-friendly status text
            errorMessage = response.status === 401
              ? 'Please sign in to continue'
              : response.status === 403
              ? 'You do not have permission to perform this action'
              : response.status === 404
              ? 'The requested resource was not found'
              : response.status === 429
              ? 'Too many requests. Please try again later.'
              : response.status >= 500
              ? 'A server error occurred. Please try again later.'
              : `An error occurred. Please try again. (Error ${response.status})`;
          }
          throw new Error(errorMessage);
        }

        let data: T;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
          } else {
            // If response is not JSON, return null
            const text = await response.text();
            logger.warn('Non-JSON response received', { url, contentType, text: text.substring(0, 100) });
            data = null as T;
          }
        } catch (error) {
          logger.error('Failed to parse JSON response', { url, error });
          throw new Error('Invalid JSON response from server');
        }
        
        const duration = Date.now() - startTime;

        setState({
          data,
          loading: false,
          error: null
        });

        trackApiCall(url, method, duration, true);
        return data;

      } catch (error) {
        // lastError = error as Error;
        
        if (attempt === retries) {
          const duration = Date.now() - startTime;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          setState({
            data: null,
            loading: false,
            error: errorMessage
          });

          logger.error(`API call failed after ${retries + 1} attempts`, {
            url,
            method,
            error: errorMessage,
            attempt: attempt + 1
          });

          trackApiCall(url, method, duration, false);
          throw error;
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }

    return null;
  }, []);

  return {
    ...state,
    call
  };
};