import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import AdminProtected from '../../../components/AdminProtected';

interface Magazine {
  id: string;
  title: string;
  description: string;
  published_at: string;
  image_url: string | null;
}

const cookieAdapter = {
  get: (key: string) => {
    const cookie = nextCookies().get(key);
    return cookie?.value ?? null;
  },
  set: () => {},
  remove: () => {},
};

export default async function AdminMagazines() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Error loading magazines: {error.message}</div>
      </div>
    );
  }
  return (
    <AdminProtected>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Magazines</h1>
          <Link
            href="/admin/magazines/new"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
          >
            Add New Magazine
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((magazine: Magazine) => (
            <div
              key={magazine.id}
              className="bg-black border border-red-900 rounded-lg overflow-hidden"
            >
              {magazine.image_url && (
                <div className="relative h-48">
                  <Image
                    src={magazine.image_url}
                    alt={magazine.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-red-600 mb-2">
                  {magazine.title}
                </h2>
                <p className="text-gray-300 mb-2">
                  {new Date(magazine.published_at).toLocaleDateString()}
                </p>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {magazine.description}
                </p>
                <div className="flex justify-end space-x-4">
                  <Link
                    href={`/admin/magazines/${magazine.id}/edit`}
                    className="text-red-600 hover:text-red-500"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/magazines/delete?id=${magazine.id}`}
                    className="text-red-600 hover:text-red-500"
                  >
                    Delete
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminProtected>
  );
}