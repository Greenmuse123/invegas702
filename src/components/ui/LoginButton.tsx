'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './Button';
import { useRouter } from 'next/navigation';

export const LoginButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  if (status === 'loading') {
    return (
      <Button variant="outline" size="sm" disabled className="min-w-[100px]">
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">
          {session.user.email}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="bg-secondary-light hover:bg-secondary"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogin}
      className="bg-secondary-light hover:bg-secondary min-w-[100px]"
    >
      Login
    </Button>
  );
}; 