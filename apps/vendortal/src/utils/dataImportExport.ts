import { logger } from './logger';
import { supabase } from '../lib/supabase';

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors: string[];
  skippedCount: number;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xlsx';
  includeHeaders?: boolean;
  dateFormat?: 'iso' | 'local';
}

// CSV Parsing Utilities
export const parseCSV = (csvContent: string): any[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row');
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) {
      logger.warn(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}`);
      continue;
    }
    
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    data.push(row);
  }
  
  return data;
};

const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"' && (i === 0 || line[i - 1] === ',')) {
      inQuotes = true;
    } else if (char === '"' && inQuotes && (i === line.length - 1 || line[i + 1] === ',')) {
      inQuotes = false;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
};

// Generate CSV from data
export const generateCSV = (data: any[], headers?: string[]): string => {
  if (data.length === 0) return '';
  
  const keys = headers || Object.keys(data[0]);
  const csvHeaders = keys.join(',');
  
  const csvRows = data.map(row => 
    keys.map(key => {
      const value = row[key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return String(value);
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Vendor Data Import/Export
export const importVendors = async (fileContent: string, format: 'csv' | 'json', userId: string): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    importedCount: 0,
    errors: [],
    skippedCount: 0
  };
  
  try {
    let vendorData: any[] = [];
    
    if (format === 'csv') {
      const rawData = parseCSV(fileContent);
      vendorData = rawData.map(row => ({
        name: row.name || row['Vendor Name'] || row['vendor_name'],
        industry: row.industry || row['Industry'] || null,
        website: row.website || row['Website'] || null,
        contact_email: row.contact_email || row['Contact Email'] || row['email'] || null,
        risk_score: parseInt(row.risk_score || row['Risk Score'] || '50') || 50,
        risk_level: row.risk_level || row['Risk Level'] || 'Medium',
        compliance_status: row.compliance_status || row['Compliance Status'] || 'Non-Compliant',
        notes: row.notes || row['Notes'] || null,
        user_id: userId
      }));
    } else if (format === 'json') {
      const parsed = JSON.parse(fileContent);
      vendorData = Array.isArray(parsed) ? parsed : [parsed];
      vendorData = vendorData.map(vendor => ({ ...vendor, user_id: userId }));
    }
    
    // Filter out invalid vendors and prepare for bulk insert
    const validVendors = vendorData.filter(vendor => {
      if (!vendor.name || vendor.name.trim() === '') {
        result.errors.push(`Skipped vendor due to missing name: ${JSON.stringify(vendor)}`);
        result.skippedCount++;
        return false;
      }
      // Ensure default values are set if not provided
      if (!vendor.risk_score) vendor.risk_score = 50;
      if (!vendor.risk_level) vendor.risk_level = 'Medium';
      if (!vendor.compliance_status) vendor.compliance_status = 'Non-Compliant';
      return true;
    });

    if (validVendors.length > 0) {
      const { error } = await supabase.from('vs_vendors').insert(validVendors);
      if (error) {
        // If bulk insert fails, try to identify which ones failed (though Supabase doesn't return per-row errors easily)
        // For simplicity, we'll mark all as failed if the bulk operation fails.
        validVendors.forEach(vendor => {
          result.errors.push(`Error importing vendor "${vendor.name}": ${error.message}`);
          result.skippedCount++;
        });
      } else {
        result.importedCount += validVendors.length;
      }
    }
    
    result.success = result.importedCount > 0;
    return result;
  } catch (err) {
    result.errors.push(`Parse error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return result;
  }
};

export const exportVendors = async (vendors: any[], options: ExportOptions): Promise<string> => {
  const exportData = vendors.map(vendor => ({
    'Vendor Name': vendor.name,
    'Industry': vendor.industry || '',
    'Website': vendor.website || '',
    'Contact Email': vendor.contact_email || '',
    'Risk Score': vendor.risk_score || 0,
    'Risk Level': vendor.risk_level || 'Medium',
    'Compliance Status': vendor.compliance_status || 'Non-Compliant',
    'Last Assessment': vendor.last_assessment_date || 'Never',
    'Notes': vendor.notes || '',
    'Created Date': options.dateFormat === 'local' 
      ? new Date(vendor.created_at).toLocaleDateString()
      : vendor.created_at
  }));
  
  if (options.format === 'csv') {
    return generateCSV(exportData);
  } else if (options.format === 'json') {
    return JSON.stringify(exportData, null, 2);
  }
  
  throw new Error(`Unsupported export format: ${options.format}`);
};

// SBOM Analysis Import/Export
export const importSBOMAnalyses = async (fileContent: string, format: 'json', userId: string): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    importedCount: 0,
    errors: [],
    skippedCount: 0
  };
  
  try {
    const parsed = JSON.parse(fileContent);
    const analyses = Array.isArray(parsed) ? parsed : [parsed];

    const validAnalyses = analyses.filter(analysis => {
      if (!analysis.filename) {
        result.errors.push(`Skipped analysis due to missing filename: ${JSON.stringify(analysis)}`);
        result.skippedCount++;
        return false;
      }
      return true;
    }).map(analysis => ({ ...analysis, user_id: userId }));

    if (validAnalyses.length > 0) {
      const { error } = await supabase.from('vs_sbom_analyses').insert(validAnalyses);
      if (error) {
        validAnalyses.forEach(analysis => {
          result.errors.push(`Error importing analysis "${analysis.filename}": ${error.message}`);
          result.skippedCount++;
        });
      } else {
        result.importedCount += validAnalyses.length;
      }
    }
    
    result.success = result.importedCount > 0;
    return result;
  } catch (err) {
    result.errors.push(`Parse error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return result;
  }
};

export const exportSBOMAnalyses = async (analyses: any[], options: ExportOptions): Promise<string> => {
  const exportData = analyses.map(analysis => ({
    'Filename': analysis.filename,
    'File Type': analysis.file_type,
    'Total Components': analysis.total_components || 0,
    'Total Vulnerabilities': analysis.total_vulnerabilities || 0,
    'Risk Score': analysis.risk_score || 0,
    'Created Date': options.dateFormat === 'local' 
      ? new Date(analysis.created_at).toLocaleDateString()
      : analysis.created_at,
    'Analysis Data': JSON.stringify(analysis.analysis_data || {})
  }));
  
  if (options.format === 'csv') {
    return generateCSV(exportData);
  } else if (options.format === 'json') {
    return JSON.stringify(analyses, null, 2);
  }
  
  throw new Error(`Unsupported export format: ${options.format}`);
};

// Assessment Import/Export
export const importAssessments = async (fileContent: string, format: 'json', userId: string): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    importedCount: 0,
    errors: [],
    skippedCount: 0
  };
  
  try {
    const parsed = JSON.parse(fileContent);
    const assessments = Array.isArray(parsed) ? parsed : [parsed];
    
    const validAssessments = assessments.filter(assessment => {
      if (!assessment.assessment_name) {
        result.errors.push(`Skipped assessment due to missing name: ${JSON.stringify(assessment)}`);
        result.skippedCount++;
        return false;
      }
      return true;
    }).map(assessment => ({ ...assessment, user_id: userId }));

    if (validAssessments.length > 0) {
      const { error } = await supabase.from('vs_supply_chain_assessments').insert(validAssessments);
      if (error) {
        validAssessments.forEach(assessment => {
          result.errors.push(`Error importing assessment "${assessment.assessment_name}": ${error.message}`);
          result.skippedCount++;
        });
      } else {
        result.importedCount += validAssessments.length;
      }
    }
    
    result.success = result.importedCount > 0;
    return result;
  } catch (err) {
    result.errors.push(`Parse error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return result;
  }
};

export const exportAssessments = async (assessments: any[], options: ExportOptions): Promise<string> => {
  if (options.format === 'json') {
    return JSON.stringify(assessments, null, 2);
  } else if (options.format === 'csv') {
    const exportData = assessments.map(assessment => ({
      'Assessment Name': assessment.assessment_name,
      'Overall Score': assessment.overall_score || 0,
      'Status': assessment.status,
      'Completed Date': assessment.completed_at 
        ? (options.dateFormat === 'local' 
          ? new Date(assessment.completed_at).toLocaleDateString()
          : assessment.completed_at)
        : 'Not completed',
      'Created Date': options.dateFormat === 'local' 
        ? new Date(assessment.created_at).toLocaleDateString()
        : assessment.created_at
    }));
    
    return generateCSV(exportData);
  }
  
  throw new Error(`Unsupported export format: ${options.format}`);
};

// File handling utilities
export const downloadFile = (content: string, filename: string, contentType: string = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// Generate sample data templates
export const generateVendorTemplate = (): string => {
  const sampleData = [
    {
      'Vendor Name': 'Example Tech Corp',
      'Industry': 'Technology',
      'Website': 'https://example-tech.com',
      'Contact Email': 'security@example-tech.com',
      'Risk Score': '75',
      'Risk Level': 'Medium',
      'Compliance Status': 'Partial',
      'Notes': 'Pending security assessment completion'
    },
    {
      'Vendor Name': 'Secure Cloud Solutions',
      'Industry': 'Cloud Services',
      'Website': 'https://secure-cloud.com',
      'Contact Email': 'compliance@secure-cloud.com',
      'Risk Score': '85',
      'Risk Level': 'Low',
      'Compliance Status': 'Compliant',
      'Notes': 'SOC 2 Type II certified'
    }
  ];
  
  return generateCSV(sampleData);
};

export const generateAssessmentTemplate = (): string => {
  const sampleData = {
    assessment_name: 'Q1 2025 Supply Chain Assessment',
    overall_score: 75,
    section_scores: [
      { title: 'Supplier Risk Management', percentage: 80, completed: true },
      { title: 'Supply Chain Threat Management', percentage: 70, completed: true }
    ],
    answers: {
      'SR-1': 'yes',
      'SR-2': 'partial',
      'TM-1': 'yes'
    },
    status: 'completed'
  };
  
  return JSON.stringify(sampleData, null, 2);
};