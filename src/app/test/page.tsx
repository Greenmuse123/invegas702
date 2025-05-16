'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/Providers';

export default function TestPage() {
  const { session } = useAuth();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session?.user?.id) {
        try {
          const { data, error } = await supabase
            .from('admins')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();

          if (error) throw error;

          console.log('Admin check result:', {
            userId: session.user.id,
            isAdmin: !!data,
            data
          });

          setAdminStatus(!!data);
        } catch (err: any) {
          console.error('Admin check error:', err);
          setError(err.message);
        }
      }
    };

    checkAdminStatus();
  }, [session]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Session Status</h2>
          <pre className="bg-gray-800 p-4 rounded">
            {JSON.stringify({
              hasSession: !!session,
              userId: session?.user?.id,
              email: session?.user?.email
            }, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Admin Status</h2>
          <pre className="bg-gray-800 p-4 rounded">
            {JSON.stringify({
              isAdmin: adminStatus,
              error
            }, null, 2)}
          </pre>
        </div>

        {adminStatus && (
          <div className="mt-8">
            <a
              href="/admin/dashboard"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
            >
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 