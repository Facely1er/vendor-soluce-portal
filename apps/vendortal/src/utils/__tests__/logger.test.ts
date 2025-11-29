import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have log method', () => {
    expect(typeof logger.log).toBe('function');
  });

  it('should have info method', () => {
    expect(typeof logger.info).toBe('function');
  });

  it('should have warn method', () => {
    expect(typeof logger.warn).toBe('function');
  });

  it('should have error method', () => {
    expect(typeof logger.error).toBe('function');
  });

  it('should have debug method', () => {
    expect(typeof logger.debug).toBe('function');
  });

  it('should log without throwing errors', () => {
    expect(() => {
      logger.log('test message');
      logger.info('test info');
      logger.warn('test warning');
      logger.error('test error');
      logger.debug('test debug');
    }).not.toThrow();
  });

  it('should handle table logging', () => {
    expect(() => {
      logger.table({ test: 'data' });
    }).not.toThrow();
  });

  it('should handle time logging', () => {
    expect(() => {
      logger.time('test');
      logger.timeEnd('test');
    }).not.toThrow();
  });

  it('should handle group logging', () => {
    expect(() => {
      logger.group('test group');
      logger.groupEnd();
    }).not.toThrow();
  });

  it('should be instantiable', () => {
    expect(logger).toBeDefined();
    expect(typeof logger).toBe('object');
  });
});

