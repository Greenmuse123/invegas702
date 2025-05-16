'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './Providers';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
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

  return <>{children}</>;
} 