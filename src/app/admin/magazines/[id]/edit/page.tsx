import React from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import AdminProtected from '../../../../../components/AdminProtected';
import Link from 'next/link';
import EditMagazineForm from './EditMagazineForm';


const cookieAdapter = {
  get: (key: string) => {
    const cookie = nextCookies().get(key);
    return cookie?.value ?? null;
  },
  set: () => {},
  remove: () => {},
};

export default async function EditMagazinePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return notFound();
  }

  // Render the edit form with fetched magazine data
  return (
    <AdminProtected>
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-8">Edit Magazine</h1>
        <div className="mb-4">
          <Link href="/admin/magazines" className="text-red-500 hover:underline">&larr; Back to All Magazines</Link>
        </div>
        <div className="bg-black/60 border border-red-900 rounded-lg p-8 max-w-xl mx-auto">
          <EditMagazineForm magazine={data} />
        </div>
      </div>
    </AdminProtected>
  );
}
