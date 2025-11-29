import { logger } from '../utils/logger';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Download, Eye, FileText, AlertTriangle, Loader } from 'lucide-react';
import { downloadTemplateFile } from '../utils/generatePdf';

const TemplatePreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { templatePath, filename } = location.state || {};

  useEffect(() => {
    if (!templatePath || !filename) {
      navigate('/templates');
      return;
    }

    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For HTML files or files that should be previewed as HTML, fetch directly
        if (filename.endsWith('.html') || filename.endsWith('.docx') || filename.endsWith('.pdf') || filename.endsWith('.pptx')) {
          // For these types, we'll try to fetch the HTML version
          const htmlPath = templatePath.replace(/\.(docx|pdf|pptx)$/, '.html');
          const response = await fetch(htmlPath);
          if (response.ok) {
            const htmlContent = await response.text();
            setContent(htmlContent);
          } else {
            throw new Error('Template preview not available');
          }
        } else {
          // For JSON, CSV, SH files, fetch as text
          const response = await fetch(templatePath);
          if (response.ok) {
            const textContent = await response.text();
            setContent(textContent);
          } else {
            throw new Error('Template not found');
          }
        }
      } catch (err) {
        logger.error('Error loading template:', err);
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [templatePath, filename, navigate]);

  const handleDownload = () => {
    if (templatePath && filename) {
      downloadTemplateFile(templatePath, filename);
    }
  };

  const isHtmlContent = filename?.endsWith('.html') || filename?.endsWith('.docx') || filename?.endsWith('.pdf') || filename?.endsWith('.pptx');
  const fileExtension = filename?.split('.').pop()?.toUpperCase() || 'FILE';

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin h-12 w-12 text-vendortal-purple mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading template preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Preview Not Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex justify-center space-x-3">
            <Button onClick={() => navigate('/templates')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <Button onClick={handleDownload} variant="primary">
              <Download className="h-4 w-4 mr-2" />
              Download Anyway
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <Button 
              onClick={() => navigate('/templates')} 
              variant="outline" 
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Template Preview</h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                {filename}
                <span className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs font-medium">
                  {fileExtension}
                </span>
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" disabled>
              <Eye className="h-4 w-4 mr-2" />
              Preview Mode
            </Button>
            <Button onClick={handleDownload} variant="primary">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isHtmlContent ? (
            <div className="relative">
              <iframe
                srcDoc={content}
                className="w-full h-screen border-0"
                title="Template Preview"
                sandbox="allow-same-origin"
              />
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Interactive Preview
                </span>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Template Content</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {content.split('\n').length} lines
                </span>
              </div>
              <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                {content}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About This Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900 dark:text-white">File Type:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{fileExtension}</span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Purpose:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">NIST SP 800-161 Compliance</span>
            </div>
            <div>
              <span className="font-medium text-gray-900 dark:text-white">Usage:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Download and customize</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>💡 Usage Tip:</strong> This template is designed to be customized for your organization's specific needs. 
              Download and modify the content to match your requirements and branding.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatePreviewPage;