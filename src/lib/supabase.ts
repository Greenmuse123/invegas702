import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey
});

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const getServerSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Storage bucket names
export const BUCKETS = {
  MAGAZINES: 'magazines-storage',
  ARTICLES: 'articles',
  EVENTS: 'events'
} as const;

type BucketName = typeof BUCKETS[keyof typeof BUCKETS];

// Helper function to upload files to Supabase Storage
export async function uploadFile(
  bucket: BucketName,
  file: File,
  path: string
): Promise<{ data: { path: string } | null; error: Error | null }> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    return { data: null, error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return { data: { path: publicUrl }, error: null };
}

// Helper function to delete files from Supabase Storage
export async function deleteFile(
  bucket: BucketName,
  path: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  return { error };
} 