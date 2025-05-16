'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../components/Providers';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { session, loading: authLoading } = useAuth();

  console.log('Dashboard Layout Render - Auth State:', { 
    session: session ? 'present' : 'null', 
    authLoading 
  });

  useEffect(() => {
    if (!authLoading && !session) {
      console.log('No session, redirecting to login');
      router.push('/login');
    }
  }, [session, authLoading, router]);

  if (authLoading) {
    console.log('Dashboard Layout - Loading state');
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Redirecting to login...</div>
      </div>
    );
  }

  console.log('Dashboard Layout - Rendering content with session:', session);

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black border-b border-red-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
          <div className="space-x-4">
            <Link href="/admin/dashboard" className="text-white hover:text-red-600">Dashboard</Link>
            <Link href="/admin/magazines" className="text-white hover:text-red-600">Magazines</Link>
            <Link href="/admin/articles" className="text-white hover:text-red-600">Articles</Link>
            <Link href="/admin/events" className="text-white hover:text-red-600">Events</Link>
            <button
              onClick={async () => {
                console.log('Logout clicked');
                await supabase.auth.signOut();
                console.log('Sign out complete');
                router.replace('/');
              }}
              className="text-white hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
} 