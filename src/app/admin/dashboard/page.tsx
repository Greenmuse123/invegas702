'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/Providers';

export default function AdminDashboard() {
  const router = useRouter();
  const { session, isAdmin, loading, refreshAdminStatus } = useAuth();

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading) {
        if (!session) {
          console.log('No session, redirecting to login');
          router.push('/login');
          return;
        }
        
        await refreshAdminStatus();
        if (!isAdmin) {
          console.log('Not an admin, redirecting to home');
          router.push('/');
        }
      }
    };

    checkAccess();
  }, [session, isAdmin, loading, router, refreshAdminStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Access Denied - Admin privileges required</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/articles"
          className="bg-red-900/50 border border-red-900 p-6 rounded-lg hover:bg-red-900/70 transition-colors cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Articles</h2>
          <p className="text-gray-400">Create, edit, and manage articles</p>
        </Link>

        <Link
          href="/admin/magazines"
          className="bg-red-900/50 border border-red-900 p-6 rounded-lg hover:bg-red-900/70 transition-colors cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Magazines</h2>
          <p className="text-gray-400">Create and manage magazine issues</p>
        </Link>

        <Link
          href="/admin/events"
          className="bg-red-900/50 border border-red-900 p-6 rounded-lg hover:bg-red-900/70 transition-colors cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Events</h2>
          <p className="text-gray-400">Create and manage upcoming events</p>
        </Link>

        <Link
          href="/admin/team"
          className="bg-red-900/50 border border-red-900 p-6 rounded-lg hover:bg-red-900/70 transition-colors cursor-pointer"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Team</h2>
          <p className="text-gray-400">Add, edit, and organize team members</p>
        </Link>
      </div>
    </div>
  );
} 