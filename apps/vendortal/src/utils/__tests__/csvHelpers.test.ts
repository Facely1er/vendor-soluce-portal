import { describe, it, expect, vi, beforeAll } from 'vitest';
import { parseVendorCSV, exportVendorCSV, downloadCSV } from '../csvHelpers';
import type { VendorCSVRow } from '../csvHelpers';

describe('CSV Helpers', () => {
  describe('parseVendorCSV', () => {
    it('should parse valid CSV data', () => {
      const csv = `name,category,dataTypes,sector,location,contact,notes,inherentRisk,residualRisk,riskLevel
Test Vendor,software,Email;Name,Technology,United States,test@example.com,Notes here,75,60,High`;

      const result = parseVendorCSV(csv);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Vendor');
      expect(result[0].category).toBe('software');
      expect(result[0].sector).toBe('Technology');
      expect(result[0].inherentRisk).toBe(75);
    });

    it('should handle CSV with only headers', () => {
      const csv = `name,category,dataTypes,sector,location,contact,notes,inherentRisk,residualRisk,riskLevel`;
      
      expect(() => parseVendorCSV(csv)).toThrow();
    });

    it('should handle CSV with default values', () => {
      const csv = `name,category
Vendor,software`;

      const result = parseVendorCSV(csv);
      expect(result[0].name).toBe('Vendor');
      expect(result[0].riskLevel).toBe('Medium');
    });

    it('should handle semicolon-separated data types', () => {
      const csv = `name,category,dataTypes
Test,software,Email;Name;Phone`;

      const result = parseVendorCSV(csv);
      expect(result[0].dataTypes).toHaveLength(3);
      expect(result[0].dataTypes).toContain('Email');
    });
  });

  describe('exportVendorCSV', () => {
    it('should export vendor data to CSV format', () => {
      const vendors: VendorCSVRow[] = [
        {
          name: 'Test Vendor',
          category: 'software',
          dataTypes: ['Email', 'Name'],
          sector: 'Technology',
          location: 'United States',
          contact: 'test@example.com',
          notes: 'Test notes',
          inherentRisk: 75,
          residualRisk: 60,
          riskLevel: 'High'
        }
      ];

      const csv = exportVendorCSV(vendors);
      
      expect(csv).toContain('Test Vendor');
      expect(csv).toContain('High');
      expect(csv).toContain('75');
    });

    it('should handle empty array', () => {
      const csv = exportVendorCSV([]);
      expect(csv).toContain('Name');
      // Should contain at least headers
      expect(csv.length).toBeGreaterThan(0);
    });
  });

  describe('downloadCSV', () => {
    // Mock URL methods for testing environment
    beforeAll(() => {
      global.URL.createObjectURL = vi.fn(() => 'blob:test');
      global.URL.revokeObjectURL = vi.fn();
    });
    
    it('should be callable', () => {
      const csv = 'name,category\nTest,software';
      const filename = 'test.csv';
      
      // Function exists and is callable
      expect(typeof downloadCSV).toBe('function');
      expect(() => downloadCSV(csv, filename)).not.toThrow();
    });

    it('should handle special characters in filename', () => {
      const csv = 'test data';
      const filename = 'test file (1).csv';
      
      expect(() => downloadCSV(csv, filename)).not.toThrow();
    });
  });
});

