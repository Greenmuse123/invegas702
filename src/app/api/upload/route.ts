import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { ArticleImageUploader, MagazineUploader, EventImageUploader } from '@/lib/uploads';
import { BUCKETS } from '@/lib/constants';

// This is a server-side component, so we can use service key securely here
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

export async function POST(request: Request) {
  try {
    // Verify authenticated user and admin status
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin');

    if (rolesError || !userRoles || userRoles.length === 0) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    // Process the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucketName = formData.get('bucket') as string || BUCKETS.ARTICLES;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Select the appropriate uploader based on the bucket
    let uploader;
    if (bucketName === BUCKETS.ARTICLES) {
      uploader = new ArticleImageUploader(adminSupabase);
    } else if (bucketName === BUCKETS.EVENTS) {
      uploader = new EventImageUploader(adminSupabase);
    } else {
      // Use MagazineUploader for all other buckets
      uploader = new MagazineUploader(adminSupabase, bucketName);
    }
    
    const { data, error } = await uploader.upload(file);

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Return the file path for client-side use
    return NextResponse.json({
      success: true,
      path: data?.path,
      url: data ? await uploader.getPublicUrl(data.path) : null,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
