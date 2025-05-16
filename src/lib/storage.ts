import { supabase } from './supabase';

export async function uploadFile(bucket: string, file: File, path: string) {
  try {
    // Ensure file is a Blob or File and not undefined/null
    if (!file) {
      return { data: null, error: new Error('No file provided') };
    }
    // Check file type and size for debugging
    if (!(file instanceof Blob)) {
      return { data: null, error: new Error('Invalid file type') };
    }
    // Upload file using Supabase Storage API
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    // Log error details for debugging
    if (error) {
      console.error('Supabase upload error:', error, { bucket, path, file });
    }
    return { data, error };
  } catch (error) {
    console.error('Error uploading file:', error, { bucket, path, file });
    return { data: null, error };
  }
}