'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/Providers';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loading: authLoading, signIn } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as unknown as { name: string; value: string };
    const { name, value } = target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt started');
    setError(null);

    try {
      console.log('Attempting login...');
      await signIn(email, password);
      console.log('Login successful');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-black border border-red-900 rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600">Login</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-900/50 border border-red-600 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={authLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {authLoading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="text-center">
            <Link href="/register" className="text-red-600 hover:text-red-500">
              Don't have an account? Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
} 