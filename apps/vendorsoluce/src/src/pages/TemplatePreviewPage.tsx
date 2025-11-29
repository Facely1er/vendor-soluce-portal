import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Download, Eye, FileText, AlertTriangle, Loader } from 'lucide-react';
import { downloadTemplateFile } from '../utils/generatePdf';
import { logger } from '../utils/logger';

const TemplatePreviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { templatePath, filename } = location.state || {};

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

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
            let htmlContent = await response.text();
            
            // Inject dark theme styles if dark mode is active
            if (isDarkMode) {
              const darkThemeStyles = `
                <style id="vendorsoluce-dark-theme">
                  * {
                    color-scheme: dark;
                  }
                  html, body {
                    background-color: #111827 !important;
                    color: #F9FAFB !important;
                  }
                  body {
                    background-color: #111827 !important;
                    color: #F9FAFB !important;
                  }
                  h1, h2, h3, h4, h5, h6 {
                    color: #FFFFFF !important;
                  }
                  h1 {
                    color: #60A5FA !important;
                    border-bottom-color: #3B82F6 !important;
                  }
                  h2 {
                    color: #34D399 !important;
                    border-bottom-color: #374151 !important;
                  }
                  h3 {
                    color: #3B82F6 !important;
                  }
                  p, span, div, li, td, th, label, dt, dd {
                    color: #E5E7EB !important;
                  }
                  table {
                    border-color: #374151 !important;
                    background-color: #1F2937 !important;
                  }
                  th, td {
                    border-color: #374151 !important;
                    color: #E5E7EB !important;
                  }
                  th {
                    background-color: #374151 !important;
                    color: #FFFFFF !important;
                  }
                  tr:nth-child(even) {
                    background-color: #1F2937 !important;
                  }
                  tr:nth-child(odd) {
                    background-color: #111827 !important;
                  }
                  code, pre {
                    background-color: #1F2937 !important;
                    color: #F9FAFB !important;
                    border-color: #374151 !important;
                  }
                  code {
                    background-color: #1F2937 !important;
                    color: #F9FAFB !important;
                  }
                  blockquote {
                    border-left-color: #4B5563 !important;
                    background-color: #1F2937 !important;
                    color: #E5E7EB !important;
                  }
                  .info-box, .tip-box, .warning-box, .note-box, .alert-box, [class*="box"] {
                    background-color: #1F2937 !important;
                    border-left-color: #3B82F6 !important;
                    color: #E5E7EB !important;
                  }
                  .info-box {
                    background-color: #1E3A5F !important;
                    border-left-color: #3B82F6 !important;
                    color: #DBEAFE !important;
                  }
                  .warning-box, .alert-box {
                    background-color: #7F1D1D !important;
                    border-left-color: #DC2626 !important;
                    color: #FEE2E2 !important;
                  }
                  .tip-box {
                    background-color: #064E3B !important;
                    border-left-color: #10B981 !important;
                    color: #D1FAE5 !important;
                  }
                  ul, ol {
                    color: #E5E7EB !important;
                  }
                  li {
                    color: #E5E7EB !important;
                  }
                  a {
                    color: #60A5FA !important;
                  }
                  a:hover {
                    color: #93C5FD !important;
                  }
                  a:visited {
                    color: #A78BFA !important;
                  }
                  strong, b {
                    color: #FFFFFF !important;
                  }
                  em, i {
                    color: #D1D5DB !important;
                  }
                  hr {
                    border-color: #374151 !important;
                  }
                  .highlight, mark {
                    background-color: #F59E0B !important;
                    color: #111827 !important;
                  }
                  .footer {
                    color: #9CA3AF !important;
                    border-top-color: #374151 !important;
                  }
                  .header-logo {
                    color: #E5E7EB !important;
                  }
                  input, textarea, select {
                    background-color: #1F2937 !important;
                    color: #F9FAFB !important;
                    border-color: #374151 !important;
                  }
                  button {
                    background-color: #3B82F6 !important;
                    color: #FFFFFF !important;
                    border-color: #2563EB !important;
                  }
                  button:hover {
                    background-color: #2563EB !important;
                  }
                </style>
              `;
              
              // Insert styles before closing head tag, or at the beginning if no head tag
              if (htmlContent.includes('</head>')) {
                htmlContent = htmlContent.replace('</head>', `${darkThemeStyles}</head>`);
              } else if (htmlContent.includes('<body>')) {
                htmlContent = htmlContent.replace('<body>', `<head>${darkThemeStyles}</head><body>`);
              } else {
                htmlContent = darkThemeStyles + htmlContent;
              }
            }
            
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
  }, [templatePath, filename, navigate, isDarkMode]);

  const handleDownload = () => {
    if (templatePath && filename) {
      downloadTemplateFile(templatePath, filename);
    }
  };

  const isHtmlContent = filename?.endsWith('.html') || filename?.endsWith('.docx') || filename?.endsWith('.pdf') || filename?.endsWith('.pptx');
  const fileExtension = filename?.split('.').pop()?.toUpperCase() || 'FILE';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader className="animate-spin h-12 w-12 text-vendorsoluce-green mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading template preview...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Template Preview</h1>
              <p className="text-gray-600 dark:text-gray-300 flex items-center text-base">
                <FileText className="h-4 w-4 mr-2" />
                <span className="font-medium">{filename}</span>
                <span className="ml-3 px-2.5 py-1 bg-vendorsoluce-green/10 dark:bg-vendorsoluce-green/20 text-vendorsoluce-green dark:text-vendorsoluce-blue rounded-md text-xs font-semibold">
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
                className="w-full h-screen border-0 bg-white dark:bg-gray-900"
                title="Template Preview"
                sandbox="allow-same-origin"
              />
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700 z-10">
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Interactive Preview
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="mb-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Template Content</h3>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                  {content.split('\n').length} lines
                </span>
              </div>
              <div className="relative">
                <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 dark:bg-gray-900 p-6 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700 max-h-[600px] overflow-y-auto leading-relaxed text-gray-800 dark:text-gray-200">
                  <code className="block text-gray-900 dark:text-gray-100">{content}</code>
                </pre>
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(content);
                    }}
                    className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors shadow-sm"
                    title="Copy to clipboard"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl">About This Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">File Type</span>
              <span className="text-base font-medium text-gray-900 dark:text-white">{fileExtension}</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Purpose</span>
              <span className="text-base font-medium text-gray-900 dark:text-white">NIST SP 800-161 Compliance</span>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Usage</span>
              <span className="text-base font-medium text-gray-900 dark:text-white">Download and customize</span>
            </div>
          </div>
          <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-lg">
            <p className="text-sm leading-relaxed text-blue-800 dark:text-blue-200">
              <strong className="font-semibold text-blue-900 dark:text-blue-100">💡 Usage Tip:</strong> This template is designed to be customized for your organization's specific needs. 
              Download and modify the content to match your requirements and branding.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatePreviewPage;