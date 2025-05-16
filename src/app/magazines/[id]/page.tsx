'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import dynamic from 'next/dynamic';

// Dynamically import the page flip viewer
const PageFlipViewer = dynamic(() => import('../../../components/magazine/PageFlipViewer'), { ssr: false });

export default function MagazinePage() {
  const [magazine, setMagazine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { supabase, session } = useAuth();

  useEffect(() => {
    const fetchMagazine = async () => {
      try {
        if (!params.id) throw new Error('No magazine ID provided');
        const { data, error } = await supabase
          .from('magazines')
          .select('*')
          .eq('id', params.id)
          .single();
        if (error) throw error;
        if (!data.pdf_url || typeof data.pdf_url !== 'string') {
          throw new Error('Invalid PDF URL');
        }
        setMagazine(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load magazine');
      } finally {
        setLoading(false);
      }
    };
    fetchMagazine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  if (error || !magazine) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-600">{error || 'Magazine not found'}</div>
      </div>
    );
  }
  if (!magazine.pdf_url || typeof magazine.pdf_url !== 'string') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-600">Invalid PDF URL</div>
      </div>
    );
  }

  // Require login to view the magazine PDF
  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
        <p className="mb-6">You must be signed in to view the full magazine.</p>
        <a href="/login" className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition">Sign In</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto">
        <div className="flex flex-col items-start mb-8">
          <h1 className="text-3xl font-bold mb-2 text-red-600">{magazine.title}</h1>
          <p className="text-gray-300">{magazine.description}</p>
        </div>
        
        <div className="w-full max-w-5xl mx-auto">
          <PageFlipViewer pdfUrl={magazine.pdf_url} />
        </div>
      </div>
    </div>
  );
}