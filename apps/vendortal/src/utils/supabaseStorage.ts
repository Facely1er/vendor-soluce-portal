import { supabase } from '../lib/supabase';

// Storage bucket configuration
const TEMPLATES_BUCKET = 'templates';
const ASSESSMENT_EVIDENCE_BUCKET = 'assessment-evidence';

/**
 * Get the public URL for a file in Supabase Storage
 */
export const getStorageUrl = (bucketName: string, filePath: string): string => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

/**
 * Get the public URL for a template file
 */
export const getTemplateUrl = (templatePath: string): string => {
  // Remove '/templates/' prefix if present
  const cleanPath = templatePath.startsWith('/templates/') 
    ? templatePath.substring('/templates/'.length)
    : templatePath.startsWith('templates/')
    ? templatePath.substring('templates/'.length)
    : templatePath;
  
  return getStorageUrl(TEMPLATES_BUCKET, cleanPath);
};

/**
 * Download a file from Supabase Storage
 */
export const downloadFromStorage = async (bucketName: string, filePath: string): Promise<Blob> => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(filePath);
  
  if (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }
  
  if (!data) {
    throw new Error('No data returned from storage');
  }
  
  return data;
};

/**
 * Check if a file exists in Supabase Storage
 */
export const fileExists = async (bucketName: string, filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(filePath.split('/').slice(0, -1).join('/'), {
        search: filePath.split('/').pop()
      });
    
    if (error) return false;
    
    return data && data.length > 0;
  } catch {
    return false;
  }
};

/**
 * Upload a file to the assessment evidence bucket
 */
export const uploadAssessmentEvidence = async (
  file: File,
  assessmentId: string,
  questionId: string
): Promise<{ path: string; url: string }> => {
  // const fileExtension = file.name.split('.').pop(); // Not used currently
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}_${timestamp}`;
  const filePath = `${assessmentId}/${questionId}/${fileName}`;

  const uploadedPath = await uploadToStorage(
    ASSESSMENT_EVIDENCE_BUCKET,
    filePath,
    file,
    { upsert: false, contentType: file.type }
  );

  const url = getStorageUrl(ASSESSMENT_EVIDENCE_BUCKET, uploadedPath);
  
  return { path: uploadedPath, url };
};

/**
 * Upload a file to Supabase Storage
 */
export const uploadToStorage = async (
  bucketName: string, 
  filePath: string, 
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string }
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      upsert: options?.upsert || false,
      contentType: options?.contentType
    });
  
  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
  
  return data.path;
};

/**
 * List files in a Storage bucket folder
 */
export const listFiles = async (bucketName: string, folderPath: string = '') => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folderPath);
  
  if (error) {
    throw new Error(`Failed to list files: ${error.message}`);
  }
  
  return data;
};