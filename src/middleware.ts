import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware - Request received:', req.nextUrl.pathname);
  
  // Create a response object
  const res = NextResponse.next();
  
  // Create a Supabase client with the request and response
  const supabase = createMiddlewareClient({ req, res });

  // Get the session cookie
  const sessionCookie = req.cookies.get('sb-session');
  console.log('Middleware - Session cookie:', {
    exists: !!sessionCookie,
    value: sessionCookie?.value ? 'present' : 'missing'
  });

  // Try to parse the session cookie
  let session = null;
  try {
    if (sessionCookie?.value) {
      session = JSON.parse(sessionCookie.value);
      console.log('Middleware - Parsed session:', {
        hasSession: !!session,
        userId: session?.user?.id,
        expiresAt: session?.expires_at
      });
    }
  } catch (error) {
    console.log('Middleware - Error parsing session cookie:', error);
  }

  // Get the current path
  const path = req.nextUrl.pathname;

  // Handle authentication redirects
  if (path === '/login') {
    console.log('Middleware - Login page check');
    // If user is already logged in, redirect to dashboard
    if (session) {
      console.log('Middleware - Redirecting to dashboard');
      const redirectTo = req.nextUrl.searchParams.get('redirectedFrom') || '/admin/dashboard';
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    return res;
  }

  // Protect admin routes
  if (path.startsWith('/admin')) {
    console.log('Middleware - Admin route check');
    if (!session) {
      console.log('Middleware - No session, redirecting to login');
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirectedFrom', path);
      return NextResponse.redirect(loginUrl);
    }
    
    // Check if user has admin role
    console.log('Middleware - Checking admin role');
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();
    
    console.log('Middleware - Role check:', {
      hasRole: !!userRole,
      role: userRole?.role,
      error: roleError?.message
    });
    
    if (!userRole || userRole.role !== 'admin') {
      console.log('Middleware - Access denied');
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    console.log('Middleware - Admin access granted');
    return res;
  }

  console.log('Middleware - Allowing request to proceed');
  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/test'],
};