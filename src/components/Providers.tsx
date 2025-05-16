'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { checkAdminStatus } from '../lib/adminUtils';
import { CartProvider } from './cart/CartContext';

interface AuthContextType {
  session: any;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  refreshAdminStatus: () => Promise<void>;
  supabase: any;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAdmin: false,
  signIn: async () => {},
  signOut: async () => {},
  loading: true,
  refreshAdminStatus: async () => {},
  supabase: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
      if (data.session?.user) {
        checkAdminStatus(supabase, data.session.user.id).then(setIsAdmin);
      } else {
        setIsAdmin(false);
      }
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkAdminStatus(supabase, session.user.id).then(setIsAdmin);
      } else {
        setIsAdmin(false);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const refreshAdminStatus = async () => {
    if (!session?.user) {
      setIsAdmin(false);
      return;
    }
    const adminStatus = await checkAdminStatus(supabase, session.user.id);
    setIsAdmin(adminStatus);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setLoading(false);
    // session and isAdmin will update via useEffect
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) throw error;
    router.push('/');
  };

  const contextValue = {
    session,
    isAdmin,
    signIn,
    signOut,
    loading,
    refreshAdminStatus,
    supabase,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}