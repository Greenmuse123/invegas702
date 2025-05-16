import { SupabaseClient } from '@supabase/supabase-js';
import { BaseUploader, UploadResult } from './BaseUploader';

// Define the specific return type for magazine uploads
export interface MagazineUploadResult {
  path: string;
  fullPath?: string;
}

export class MagazineUploader extends BaseUploader<MagazineUploadResult> {
  constructor(client: SupabaseClient, bucketName: string = 'magazines-storage') {
    super(client, bucketName);
  }

  /**
   * Validates magazine files (PDF or images)
   * @param file The file to validate
   * @returns True if valid, false otherwise
   */
  protected validateFile(file: File): boolean {
    // For PDF validation
    if (file.name.toLowerCase().endsWith('.pdf')) {
      // Check file size (max 50MB for PDFs)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        console.error('PDF is too large', file.size);
        return false;
      }
      return true;
    }
    
    // For image validation (cover images)
    if (file.type.startsWith('image/')) {
      // Check file size (max 10MB for images)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        console.error('Image is too large', file.size);
        return false;
      }
      return true;
    }

    console.error('Unsupported file type', file.type);
    return false;
  }

  /**
   * Generates a path for magazine files
   * @param file The file to generate path for
   * @returns The path string
   */
  protected generatePath(file: File): string {
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    if (file.name.toLowerCase().endsWith('.pdf')) {
      return `pdfs/${Date.now()}-${cleanFilename}`;
    } else {
      return `covers/${Date.now()}-${cleanFilename}`;
    }
  }

  /**
   * Formats the upload result for magazine files
   * @param data The upload result data
   * @param error The upload error if any
   * @returns Formatted upload result
   */
  protected formatResult(data: any, error: any): UploadResult<MagazineUploadResult> {
    if (error) {
      return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
    }

    return {
      data: {
        path: data?.path || '',
        fullPath: data ? `${this.bucketName}/${data.path}` : undefined,
      },
      error: null,
    };
  }
}
