'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../components/Providers';
import AdminProtected from '../../../../components/AdminProtected';

export default function DeleteMagazine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { supabase } = useAuth();
  const [magazine, setMagazine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMagazine = async () => {
      if (!id) {
        setError('No magazine ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('magazines')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setMagazine(data);
      } catch (err: any) {
        console.error('Error fetching magazine:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMagazine();
  }, [id, supabase]);

  const handleDelete = async () => {
    if (!id) return;
    
    setDeleting(true);
    setError(null);
    
    try {
      // First, check if we need to delete any associated files
      if (magazine?.pdf_url) {
        // Extract the path from the URL if needed
        const pdfPath = magazine.pdf_url.includes('/') 
          ? magazine.pdf_url.split('/').pop() 
          : magazine.pdf_url;
          
        await supabase.storage.from('magazines-storage').remove([`pdfs/${pdfPath}`]);
      }
      
      if (magazine?.image_url) {
        // Extract the path from the URL if needed
        const imagePath = magazine.image_url.includes('/') 
          ? magazine.image_url.split('/').pop() 
          : magazine.image_url;
          
        await supabase.storage.from('magazines-storage').remove([`covers/${imagePath}`]);
      }

      // Delete the magazine record
      const { error } = await supabase
        .from('magazines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Navigate back to the magazines list
      router.push('/admin/magazines');
    } catch (err: any) {
      console.error('Error deleting magazine:', err);
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminProtected>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </AdminProtected>
    );
  }

  if (error && !magazine) {
    return (
      <AdminProtected>
        <div className="min-h-screen bg-black text-white p-8">
          <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-900 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={() => router.push('/admin/magazines')}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
            >
              Back to Magazines
            </button>
          </div>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Delete Magazine</h1>
            
            <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 mb-6">
              <p className="text-lg font-medium mb-2">
                Are you sure you want to delete this magazine?
              </p>
              <p className="text-gray-300 mb-2">
                <strong>Title:</strong> {magazine?.title}
              </p>
              <p className="text-gray-300 mb-4">
                This action cannot be undone. All associated files and data will be permanently removed.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => router.push('/admin/magazines')}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-4 py-2 bg-red-600 text-white rounded ${
                  deleting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'
                } transition`}
              >
                {deleting ? 'Deleting...' : 'Delete Magazine'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminProtected>
  );
}
