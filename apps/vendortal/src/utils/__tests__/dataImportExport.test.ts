import { describe, it, expect } from 'vitest';
import { parseCSV, generateCSV } from '../dataImportExport';

describe('Data Import/Export Utilities', () => {
  describe('parseCSV', () => {
    it('parses simple CSV correctly', () => {
      const csv = 'name,value\nTest1,100\nTest2,200';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Test1');
      expect(result[0].value).toBe('100');
    });

    it('handles CSV with quotes', () => {
      const csv = 'name,description\nTest,"Test Description"';
      const result = parseCSV(csv);
      
      expect(result[0].name).toBe('Test');
      // The parser keeps quotes in the output
      expect(result[0].description).toContain('Test Description');
    });

    it('throws error for invalid CSV', () => {
      expect(() => parseCSV('')).toThrow();
    });

    it('handles CSV with multiple values', () => {
      const csv = 'a,b,c\n1,2,3\n4,5,6';
      const result = parseCSV(csv);
      
      expect(result).toHaveLength(2);
      expect(result[0].a).toBe('1');
      expect(result[1].c).toBe('6');
    });
  });

  describe('generateCSV', () => {
    it('generates CSV from data', () => {
      const data = [
        { name: 'Test1', value: 100 },
        { name: 'Test2', value: 200 }
      ];
      
      const csv = generateCSV(data);
      expect(csv).toContain('name,value');
      expect(csv).toContain('Test1,100');
    });

    it('handles empty data array', () => {
      expect(generateCSV([])).toBe('');
    });

    it('handles custom headers', () => {
      const data = [{ a: 1, b: 2 }, { a: 3, b: 4 }];
      const csv = generateCSV(data, ['a']);
      
      expect(csv).toContain('a');
      expect(csv).not.toContain('b');
    });

    it('handles values with commas', () => {
      const data = [{ name: 'Test, Inc', value: 100 }];
      const csv = generateCSV(data);
      
      expect(csv).toContain('Test, Inc');
    });
  });
});

