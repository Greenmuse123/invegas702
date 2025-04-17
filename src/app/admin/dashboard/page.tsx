'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-red-600">Welcome to the Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/magazines" className="p-6 bg-black border border-red-900 rounded-lg hover:border-red-600 transition-colors">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Magazines</h2>
          <p className="text-gray-400">Manage magazine issues and content</p>
        </Link>

        <Link href="/admin/articles" className="p-6 bg-black border border-red-900 rounded-lg hover:border-red-600 transition-colors">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Articles</h2>
          <p className="text-gray-400">Manage articles and blog posts</p>
        </Link>

        <Link href="/admin/events" className="p-6 bg-black border border-red-900 rounded-lg hover:border-red-600 transition-colors">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Events</h2>
          <p className="text-gray-400">Manage upcoming events and promotions</p>
        </Link>
      </div>
    </div>
  );
} 