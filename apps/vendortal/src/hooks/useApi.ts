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

export const useApi = <T = unknown>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

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
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
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