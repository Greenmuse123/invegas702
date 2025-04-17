'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PDFViewer from '../../components/magazine/PDFViewer';
import Image from 'next/image';

interface Magazine {
  id: string;
  title: string;
  issue_number: number;
  cover_image_url: string;
  description: string;
  pdf_url: string;
  total_pages: number;
  published_at: string;
}

export default function MagazinesPage() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        const { data, error } = await supabase
          .from('magazines')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setMagazines(data || []);
      } catch (error) {
        console.error('Error fetching magazines:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMagazines();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading magazines...</div>
      </div>
    );
  }

  if (selectedMagazine) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <button
          onClick={() => setSelectedMagazine(null)}
          className="mb-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Back to Issues
        </button>
        <h1 className="text-3xl font-bold mb-4 text-red-600">{selectedMagazine.title}</h1>
        <PDFViewer
          pdfUrl={selectedMagazine.pdf_url}
          totalPages={selectedMagazine.total_pages}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-600">Magazine Issues</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magazines.map((magazine) => (
          <div
            key={magazine.id}
            className="bg-black border border-red-900 rounded-lg overflow-hidden hover:border-red-600 transition-colors cursor-pointer"
            onClick={() => setSelectedMagazine(magazine)}
          >
            <div className="relative h-64">
              <Image
                src={magazine.cover_image_url}
                alt={magazine.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-red-600 mb-2">{magazine.title}</h2>
              <p className="text-gray-300 mb-2">Issue #{magazine.issue_number}</p>
              <p className="text-gray-400">{magazine.description}</p>
              <p className="text-gray-500 mt-2">
                Published: {new Date(magazine.published_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      {magazines.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          No magazine issues available at the moment.
        </div>
      )}
    </div>
  );
} 