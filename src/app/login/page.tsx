'use client';
// @ts-nocheck
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/Providers';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { loading: authLoading, signIn } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-black border border-red-900 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-800 focus:outline-none focus:border-red-600"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-800 focus:outline-none focus:border-red-600"
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            disabled={authLoading}
          >
            {authLoading ? 'Signing In...' : 'Sign In'}
          </button>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
        <div className="text-sm mt-4 text-center">
          Don't have an account? <Link href="/register" className="text-red-400 hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}