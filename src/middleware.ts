import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('Middleware running for:', request.nextUrl.pathname);
  
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Ensure cookie values are parsed as JSON if needed
          const value = request.cookies.get(name)?.value;
          try {
            return value && JSON.parse(value);
          } catch {
            return value;
          }
        },
        set(name: string, value: string, options: any) {
          // Ensure value is stringified JSON if it's an object
          const toStore = typeof value === 'object' ? JSON.stringify(value) : value;
          res.cookies.set({
            name,
            value: toStore,
            ...options,
          });
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session check:', { hasSession: !!session, error: sessionError });

    // Check if user is trying to access login page while logged in
    if (request.nextUrl.pathname === '/login' && session) {
      console.log('Logged in user trying to access login page, redirecting to dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // For admin routes, check admin status
    if (request.nextUrl.pathname.startsWith('/admin')) {
      console.log('Admin route detected');
      
      if (!session) {
        console.log('No session, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Check if user is an admin (check both admins and user_roles tables)
      const { data: adminsData, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', session.user.id);

      let isAdmin = Array.isArray(adminsData) && adminsData.length > 0;
      if (!isAdmin) {
        // Fallback: check user_roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('role', 'admin');
        if (rolesError) {
          console.error('Admin check error (user_roles table):', rolesError);
        }
        isAdmin = Array.isArray(rolesData) && rolesData.length > 0;
      }

      console.log('Admin check:', { isAdmin, error: adminError });

      if (!isAdmin) {
        console.log('User is not an admin, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/login']
};