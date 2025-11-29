import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { 
  Upload, 
  FileSpreadsheet, 
  FileJson, 
  AlertCircle, 
  CheckCircle, 
  X,
  FileText,
  Info,
  File
} from 'lucide-react';
import { 
  importVendors, 
  exportVendors, 
  importSBOMAnalyses, 
  exportSBOMAnalyses,
  importAssessments,
  exportAssessments,
  downloadFile, 
  readFileAsText,
  generateVendorTemplate,
  generateAssessmentTemplate,
  type ImportResult,
  type ExportOptions
} from '../../utils/dataImportExport';
import { useAuth } from '../../context/AuthContext';
import { logger } from '../../utils/logger';

interface DataImportExportProps {
  dataType: 'vendors' | 'sbom_analyses' | 'assessments';
  data: Record<string, unknown>[];
  onImportComplete?: (result: ImportResult) => void;
  onRefresh?: () => void;
}

const DataImportExport: React.FC<DataImportExportProps> = ({
  dataType,
  data,
  onImportComplete,
  onRefresh
}) => {
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const getDataTypeLabel = () => {
    switch (dataType) {
      case 'vendors': return 'Vendors';
      case 'sbom_analyses': return 'SBOM Analyses';
      case 'assessments': return 'Assessments';
      default: return 'Data';
    }
  };

  const getSupportedFormats = () => {
    switch (dataType) {
      case 'vendors': return ['csv', 'json', 'pdf'];
      case 'sbom_analyses': return ['json', 'pdf'];
      case 'assessments': return ['json', 'pdf'];
      default: return ['csv', 'json', 'pdf'];
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await handleFileImport(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFileImport(file);
      e.target.value = ''; // Reset input
    }
  };

  const handleFileImport = async (file: File) => {
    if (!user) {
      alert('Please log in to import data');
      return;
    }

    setIsImporting(true);
    setImportResult(null);
    
    try {
      const content = await readFileAsText(file);
      const format = file.name.endsWith('.json') ? 'json' : 'csv';
      
      let result: ImportResult;
      
      switch (dataType) {
        case 'vendors':
          result = await importVendors(content, format, user.id);
          break;
        case 'sbom_analyses':
          if (format !== 'json') {
            throw new Error('SBOM analyses only support JSON format');
          }
          result = await importSBOMAnalyses(content, format, user.id);
          break;
        case 'assessments':
          if (format !== 'json') {
            throw new Error('Assessments only support JSON format');
          }
          result = await importAssessments(content, format, user.id);
          break;
        default:
          throw new Error(`Unsupported data type: ${dataType}`);
      }
      
      setImportResult(result);
      if (result.success && onImportComplete) {
        onImportComplete(result);
      }
      if (result.success && onRefresh) {
        onRefresh();
      }
    } catch (error) {
      setImportResult({
        success: false,
        importedCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        skippedCount: 0
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    setIsExporting(true);
    
    try {
      const options: ExportOptions = {
        format,
        includeHeaders: true,
        dateFormat: 'local'
      };
      
      // PDF exports are handled differently - they trigger download directly
      if (format === 'pdf') {
        switch (dataType) {
          case 'vendors':
            await exportVendors(data, options);
            break;
          case 'sbom_analyses':
            await exportSBOMAnalyses(data, options);
            break;
          case 'assessments':
            await exportAssessments(data, options);
            break;
          default:
            throw new Error(`Unsupported data type: ${dataType}`);
        }
      } else {
        // CSV and JSON exports return content to download
        let content: string;
        let filename: string;
        let contentType: string;
        
        switch (dataType) {
          case 'vendors':
            content = await exportVendors(data, options);
            filename = `vendors_export_${new Date().toISOString().split('T')[0]}.${format}`;
            contentType = format === 'csv' ? 'text/csv' : 'application/json';
            break;
          case 'sbom_analyses':
            content = await exportSBOMAnalyses(data, options);
            filename = `sbom_analyses_export_${new Date().toISOString().split('T')[0]}.${format}`;
            contentType = format === 'csv' ? 'text/csv' : 'application/json';
            break;
          case 'assessments':
            content = await exportAssessments(data, options);
            filename = `assessments_export_${new Date().toISOString().split('T')[0]}.${format}`;
            contentType = format === 'csv' ? 'text/csv' : 'application/json';
            break;
          default:
            throw new Error(`Unsupported data type: ${dataType}`);
        }
        
        downloadFile(content, filename, contentType);
      }
    } catch (error) {
      logger.error('Export error:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    let content: string;
    let filename: string;
    let contentType: string;
    
    switch (dataType) {
      case 'vendors':
        content = generateVendorTemplate();
        filename = 'vendor_import_template.csv';
        contentType = 'text/csv';
        break;
      case 'assessments':
        content = generateAssessmentTemplate();
        filename = 'assessment_import_template.json';
        contentType = 'application/json';
        break;
      default:
        return;
    }
    
    downloadFile(content, filename, contentType);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowImportModal(true)}
          className="flex items-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import {getDataTypeLabel()}
        </Button>
        
        <div className="flex gap-2">
          {getSupportedFormats().includes('csv') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={isExporting || data.length === 0}
              className="flex items-center"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('json')}
            disabled={isExporting || data.length === 0}
            className="flex items-center"
          >
            <FileJson className="h-4 w-4 mr-2" />
            Export JSON
          </Button>

          {getSupportedFormats().includes('pdf') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('pdf')}
              disabled={isExporting || data.length === 0}
              className="flex items-center"
            >
              <File className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Import {getDataTypeLabel()}
              </h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportResult(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close import modal"
                title="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Import Instructions */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Import Instructions</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Import formats: {getSupportedFormats().filter(f => f !== 'pdf').join(', ').toUpperCase()}. 
                      Export formats: {getSupportedFormats().join(', ').toUpperCase()}.
                      {dataType === 'vendors' && ' Download the template below to see the required column format.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Download */}
              {(dataType === 'vendors' || dataType === 'assessments') && (
                <div className="mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              )}

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive 
                    ? 'border-vendorsoluce-green bg-vendorsoluce-pale-green dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="import-file"
                  className="hidden"
                  onChange={handleFileInput}
                  accept={getSupportedFormats().includes('csv') ? '.csv,.json' : '.json'}
                />
                
                <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Supports {getSupportedFormats().join(', ').toUpperCase()} files
                </p>
                
                <label htmlFor="import-file">
                  <Button variant="outline" disabled={isImporting}>
                    {isImporting ? 'Importing...' : 'Choose File'}
                  </Button>
                </label>
              </div>

              {/* Import Progress */}
              {isImporting && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vendorsoluce-green mr-2"></div>
                  <span className="text-gray-600 dark:text-gray-300">Processing import...</span>
                </div>
              )}

              {/* Import Results */}
              {importResult && (
                <div className="mt-6">
                  <div className={`p-4 rounded-md border ${
                    importResult.success 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-start">
                      {importResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3 className={`font-medium mb-2 ${
                          importResult.success 
                            ? 'text-green-800 dark:text-green-300'
                            : 'text-red-800 dark:text-red-300'
                        }`}>
                          {importResult.success ? 'Import Completed' : 'Import Failed'}
                        </h3>
                        
                        <div className="text-sm space-y-1">
                          <p className={importResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                            Imported: {importResult.importedCount} records
                          </p>
                          {importResult.skippedCount > 0 && (
                            <p className="text-yellow-700 dark:text-yellow-400">
                              Skipped: {importResult.skippedCount} records
                            </p>
                          )}
                        </div>
                        
                        {importResult.errors.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Errors:</p>
                            <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 max-h-32 overflow-y-auto">
                              {importResult.errors.slice(0, 10).map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                              {importResult.errors.length > 10 && (
                                <li>• ... and {importResult.errors.length - 10} more errors</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataImportExport;