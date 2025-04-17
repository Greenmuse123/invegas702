'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useRouter, useSearchParams } from 'next/navigation';

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAuthChange = useCallback((_event: string, session: Session | null) => {
    console.log('Auth state changed:', { 
      event: _event, 
      hasSession: !!session,
      session: session ? 'present' : 'null'
    });
    
    setSession(session);
    setLoading(false);
    
    if (_event === 'SIGNED_IN' && session) {
      const redirectTo = searchParams.get('redirectedFrom') || '/admin/dashboard';
      console.log('Redirecting after sign in:', {
        redirectTo,
        sessionPresent: !!session
      });
      router.replace(redirectTo);
    }
  }, [router, searchParams]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      console.log('Sign in response:', { 
        hasData: !!data, 
        hasError: !!error,
        error: error?.message,
        session: data?.session ? 'present' : 'null'
      });
      
      if (error) throw error;
      
      // Ensure session is set
      if (data?.session) {
        setSession(data.session);
        const redirectTo = searchParams.get('redirectedFrom') || '/admin/dashboard';
        router.replace(redirectTo);
      }
    } finally {
      setLoading(false);
    }
  }, [router, searchParams]);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log('Initial session check:', session ? 'present' : 'null');
        setSession(session);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);