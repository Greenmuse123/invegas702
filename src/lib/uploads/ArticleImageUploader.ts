import { SupabaseClient } from '@supabase/supabase-js';
import { BaseUploader, UploadResult } from './BaseUploader';
import { BUCKETS } from '../constants';

// Define the specific return type for article image uploads
export interface ArticleImageResult {
  path: string;
  fullPath?: string;
}

export class ArticleImageUploader extends BaseUploader<ArticleImageResult> {
  constructor(client: SupabaseClient) {
    super(client, BUCKETS.ARTICLES);
  }

  /**
   * Validates article image files
   * @param file The file to validate
   * @returns True if valid, false otherwise
   */
  protected validateFile(file: File): boolean {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      console.error('File is not an image', file.type);
      return false;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('File is too large', file.size);
      return false;
    }

    return true;
  }

  /**
   * Generates a path for article images
   * @param file The file to generate path for
   * @returns The path string
   */
  protected generatePath(file: File): string {
    return `images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  }

  /**
   * Formats the upload result for article images
   * @param data The upload result data
   * @param error The upload error if any
   * @returns Formatted upload result
   */
  protected formatResult(data: any, error: any): UploadResult<ArticleImageResult> {
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

  /**
   * Gets a public URL for a file
   * @param path The path of the file
   * @returns The public URL or null
   */
  public async getPublicUrl(path: string): Promise<string | null> {
    try {
      // For Supabase Storage, we need to construct a proper URL
      const { data } = this.client.storage.from(this.bucketName).getPublicUrl(path);
      
      // Check if the URL was generated properly
      if (!data?.publicUrl) {
        console.error('Failed to generate public URL for', path);
        return null;
      }
      
      console.log('Generated public URL:', data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error(`Error getting public URL:`, error, { path, bucket: this.bucketName });
      return null;
    }
  }
}
