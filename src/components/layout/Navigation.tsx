'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/Providers';

export function Navigation() {
  const pathname = usePathname();
  const { session, signOut } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-black border-b border-red-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/invegas702 logo.png"
              alt="InVegas702 Logo"
              width={150}
              height={50}
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/magazines"
              className={`text-lg font-medium transition-colors ${
                isActive('/magazines')
                  ? 'text-red-600'
                  : 'text-gray-300 hover:text-red-600'
              }`}
            >
              Magazines
            </Link>
            <Link
              href="/articles"
              className={`text-lg font-medium transition-colors ${
                isActive('/articles')
                  ? 'text-red-600'
                  : 'text-gray-300 hover:text-red-600'
              }`}
            >
              Articles
            </Link>
            <Link
              href="/events"
              className={`text-lg font-medium transition-colors ${
                isActive('/events')
                  ? 'text-red-600'
                  : 'text-gray-300 hover:text-red-600'
              }`}
            >
              Events
            </Link>
            <Link
              href="/about"
              className={`text-lg font-medium transition-colors ${
                isActive('/about')
                  ? 'text-red-600'
                  : 'text-gray-300 hover:text-red-600'
              }`}
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="text-lg font-medium text-gray-300 hover:text-red-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 