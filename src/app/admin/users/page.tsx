'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  is_admin: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email');

      if (usersError) throw usersError;

      const { data: adminsData, error: adminsError } = await supabase
        .from('admins')
        .select('user_id');

      if (adminsError) throw adminsError;

      const adminIds = new Set(adminsData?.map(admin => admin.user_id) || []);
      
      const usersWithAdminStatus = usersData?.map(user => ({
        id: user.id,
        email: user.email,
        is_admin: adminIds.has(user.id)
      })) || [];

      setUsers(usersWithAdminStatus);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        // Remove admin
        const { error } = await supabase
          .from('admins')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Add admin
        const { error } = await supabase
          .from('admins')
          .insert([{ user_id: userId }]);

        if (error) throw error;
      }

      // Refresh users list
      await fetchUsers();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-600">User Management</h1>
          <Link href="/admin/magazines" className="text-white hover:text-red-600">
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-black border border-red-900 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-red-900">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Admin Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.is_admin ? 'Admin' : 'User'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleAdmin(user.id, user.is_admin)}
                      className={`px-3 py-1 rounded ${
                        user.is_admin
                          ? 'bg-red-900 text-white hover:bg-red-800'
                          : 'bg-green-900 text-white hover:bg-green-800'
                      }`}
                    >
                      {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 