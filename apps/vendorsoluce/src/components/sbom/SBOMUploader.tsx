import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface SBOMUploaderProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;
}

const SBOMUploader: React.FC<SBOMUploaderProps> = ({ onUpload, isLoading = false }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ['application/json', 'text/xml', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JSON, XML, or text file.');
      return false;
    }
    
    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10MB.');
      return false;
    }
    
    setError(null);
    return true;
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };
  
  const handleSubmit = () => {
    if (file) {
      onUpload(file);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="w-full">
      {/* File upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-supply-chain-teal bg-supply-chain-teal/5' : 'border-gray-300 dark:border-gray-600'
        } ${file ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700' : ''} transition-colors`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInput}
          accept=".json,.xml,.txt,.spdx,.cdx"
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">{file.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {(file.size / 1024).toFixed(2)} KB
            </p>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? t('sbom.upload.analyzing') : t('sbom.results.title')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-supply-chain-teal" />
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {t('sbom.upload.dropHere')}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {t('sbom.upload.supportedFormats')}
            </p>
            <Button variant="outline" className="cursor-pointer" onClick={handleBrowseClick}>
              {t('sbom.upload.browseFiles')}
            </Button>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start border border-red-200 dark:border-red-800">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SBOMUploader;