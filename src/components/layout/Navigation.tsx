'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { useCart } from '@/components/cart/CartContext';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, signOut, isAdmin, refreshAdminStatus } = useAuth();
  const { cart } = useCart();

  const isActive = (path: string) => pathname === path;

  const handleDashboardClick = async () => {
    if (session) {
      try {
        await refreshAdminStatus();
        if (isAdmin) {
          console.log('User is admin, navigating to dashboard');
          router.push('/admin/dashboard');
        } else {
          console.log('User is not an admin');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
  };

  return (
    <nav className="bg-black border-b border-red-900">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/invegas702 logo.png"
              alt="Invegas 702 Logo"
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
              href="/shop"
              className={`text-lg font-medium transition-colors ${
                isActive('/shop')
                  ? 'text-red-600'
                  : 'text-gray-300 hover:text-red-600'
              }`}
            >
              Shop
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
            {/* Cart icon, always visible, styled premium and moved after About */}
            <Link
              href="/cart"
              className="relative flex items-center text-lg font-bold text-white hover:text-red-500 transition-colors ml-2 group"
              aria-label="View Cart"
            >
              <span className="relative flex items-center">
                <svg
                  className="w-7 h-7 text-white group-hover:text-red-500 transition-colors drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9" />
                  <circle cx="9" cy="22" r="1.5" fill="#ef4444" stroke="none" />
                  <circle cx="19" cy="22" r="1.5" fill="#ef4444" stroke="none" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-lg border-2 border-black z-10">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </span>
              <span className="ml-2 hidden lg:inline-block tracking-wide">Cart</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {isAdmin && (
                  <button
                    onClick={handleDashboardClick}
                    className="text-lg font-medium text-gray-300 hover:text-red-600 transition-colors"
                  >
                    Dashboard
                  </button>
                )}
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