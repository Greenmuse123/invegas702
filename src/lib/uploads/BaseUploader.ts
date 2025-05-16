import { SupabaseClient } from '@supabase/supabase-js';

export interface UploadResult<T = unknown> {
  data: T | null;
  error: Error | null;
}

export abstract class BaseUploader<T = unknown> {
  protected client: SupabaseClient;
  protected bucketName: string;

  constructor(client: SupabaseClient, bucketName: string) {
    this.client = client;
    this.bucketName = bucketName;
  }

  /**
   * Validates the file before upload
   * @param file The file to validate
   * @returns True if valid, false otherwise
   */
  protected abstract validateFile(file: File): boolean;

  /**
   * Generates a unique path for the file
   * @param file The file to generate path for
   * @returns The path string
   */
  protected abstract generatePath(file: File): string;

  /**
   * Format the result of the upload
   * @param data The upload result data
   * @param error The upload error if any
   * @returns Formatted upload result
   */
  protected abstract formatResult(data: any, error: any): UploadResult<T>;

  /**
   * Uploads a file to the storage bucket
   * @param file The file to upload
   * @returns Upload result with data or error
   */
  public async upload(file: File): Promise<UploadResult<T>> {
    try {
      // Validate file
      if (!file) {
        return { data: null, error: new Error('No file provided') };
      }

      if (!this.validateFile(file)) {
        return { data: null, error: new Error('File validation failed') };
      }

      // Generate path
      const path = this.generatePath(file);

      // Upload file
      const { data, error } = await this.client.storage
        .from(this.bucketName)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      // Log error details for debugging
      if (error) {
        console.error(`Upload error to ${this.bucketName}:`, error, { path, file });
      }

      // Format and return result
      return this.formatResult(data, error);
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.upload:`, error, { file });
      return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
    }
  }

  /**
   * Gets a public URL for a file
   * @param path The path of the file
   * @returns The public URL or null
   */
  public async getPublicUrl(path: string): Promise<string | null> {
    try {
      const { data } = this.client.storage.from(this.bucketName).getPublicUrl(path);
      return data?.publicUrl || null;
    } catch (error) {
      console.error(`Error getting public URL:`, error, { path, bucket: this.bucketName });
      return null;
    }
  }

  /**
   * Creates a signed URL for a file with expiration
   * @param path The path of the file
   * @param expiresIn Expiration time in seconds
   * @returns The signed URL or null
   */
  public async getSignedUrl(path: string, expiresIn = 60 * 60): Promise<string | null> {
    try {
      const { data, error } = await this.client.storage
        .from(this.bucketName)
        .createSignedUrl(path, expiresIn);

      if (error) {
        console.error(`Error creating signed URL:`, error, { path, bucket: this.bucketName });
        return null;
      }

      return data?.signedUrl || null;
    } catch (error) {
      console.error(`Error creating signed URL:`, error, { path, bucket: this.bucketName });
      return null;
    }
  }
}
