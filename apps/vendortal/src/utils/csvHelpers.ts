/**
 * CSV Import/Export utilities for vendor data
 */

export interface VendorCSVRow {
  name: string;
  category: string;
  dataTypes: string[];
  sector: string;
  location: string;
  contact: string;
  notes: string;
  inherentRisk: number;
  residualRisk: number;
  riskLevel: string;
}

/**
 * Parse CSV text into vendor objects
 */
export function parseVendorCSV(csvText: string): VendorCSVRow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file is empty or invalid');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const vendors: VendorCSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVLine(line);
    if (values.length < headers.length) continue;

    const vendor: VendorCSVRow = {
      name: values[0] || 'Unknown Vendor',
      category: values[1] || 'tactical',
      dataTypes: values[2] ? values[2].split(';').map(d => d.trim()) : [],
      sector: values[3] || 'Other',
      location: values[4] || 'United States',
      contact: values[5] || '',
      notes: values[6] || '',
      inherentRisk: parseFloat(values[7]) || 50,
      residualRisk: parseFloat(values[8]) || 50,
      riskLevel: values[9] || 'Medium'
    };

    vendors.push(vendor);
  }

  return vendors;
}

/**
 * Parse a CSV line handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

/**
 * Convert vendor objects to CSV text
 */
export function exportVendorCSV(vendors: Array<Partial<VendorCSVRow>>): string {
  const headers = [
    'Name',
    'Category',
    'Data Types',
    'Sector',
    'Location',
    'Contact',
    'Notes',
    'Inherent Risk',
    'Residual Risk',
    'Risk Level'
  ];

  const csvLines = [headers.join(',')];

  vendors.forEach(vendor => {
    const values = [
      vendor.name || '',
      vendor.category || '',
      (vendor.dataTypes || []).join(';'),
      vendor.sector || '',
      vendor.location || '',
      vendor.contact || '',
      vendor.notes || '',
      (vendor.inherentRisk || 0).toString(),
      (vendor.residualRisk || 0).toString(),
      vendor.riskLevel || ''
    ];

    // Escape values with commas
    const escapedValues = values.map(val => {
      if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });

    csvLines.push(escapedValues.join(','));
  });

  return csvLines.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate sample vendor CSV data
 */
export function generateSampleVendorsCSV(): string {
  const sampleVendors: VendorCSVRow[] = [
    {
      name: 'CloudTech Solutions',
      category: 'critical',
      dataTypes: ['PII', 'Financial'],
      sector: 'Technology',
      location: 'United States',
      contact: 'security@cloudtech.example',
      notes: 'Primary cloud infrastructure provider',
      inherentRisk: 85,
      residualRisk: 65,
      riskLevel: 'High'
    },
    {
      name: 'DataGuard Inc',
      category: 'strategic',
      dataTypes: ['PII', 'Health'],
      sector: 'Healthcare',
      location: 'European Union',
      contact: 'compliance@dataguard.example',
      notes: 'Healthcare data processing',
      inherentRisk: 70,
      residualRisk: 55,
      riskLevel: 'High'
    },
    {
      name: 'SecurePayments Co',
      category: 'critical',
      dataTypes: ['Financial', 'Credentials'],
      sector: 'Finance',
      location: 'United States',
      contact: 'support@securepay.example',
      notes: 'Payment processing gateway',
      inherentRisk: 90,
      residualRisk: 70,
      riskLevel: 'Critical'
    }
  ];

  return exportVendorCSV(sampleVendors);
}

