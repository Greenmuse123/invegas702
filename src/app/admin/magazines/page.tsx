'use client';

import React, { useState, useEffect } from 'react';
import { supabase, BUCKETS, uploadFile } from '../../../lib/supabase';
import Image from 'next/image';

type MagazineStatus = 'draft' | 'published';

interface Magazine {
  id: string;
  title: string;
  issue_number: number;
  cover_image_url: string;
  description: string;
  pdf_url: string;
  total_pages: number;
  status: MagazineStatus;
  published_at: string | null;
}

interface FormData {
  title: string;
  issue_number: string;
  description: string;
  total_pages: string;
  status: MagazineStatus;
}

export default function AdminMagazines() {
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    issue_number: '',
    description: '',
    total_pages: '',
    status: 'draft',
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchMagazines();
  }, []);

  const fetchMagazines = async () => {
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setMagazines(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let coverImageUrl: string | null = null;
      let pdfUrl: string | null = null;

      if (coverImage) {
        const { data: coverData, error: coverError } = await uploadFile(
          BUCKETS.MAGAZINES,
          coverImage,
          `covers/${Date.now()}-${coverImage.name}`
        );
        if (coverError) throw coverError;
        if (coverData?.path) {
          coverImageUrl = coverData.path;
        }
      }

      if (pdfFile) {
        const { data: pdfData, error: pdfError } = await uploadFile(
          BUCKETS.MAGAZINES,
          pdfFile,
          `pdfs/${Date.now()}-${pdfFile.name}`
        );
        if (pdfError) throw pdfError;
        if (pdfData?.path) {
          pdfUrl = pdfData.path;
        }
      }

      const { error } = await supabase.from('magazines').insert({
        ...formData,
        issue_number: parseInt(formData.issue_number),
        total_pages: parseInt(formData.total_pages),
        cover_image_url: coverImageUrl,
        pdf_url: pdfUrl,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
      });

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        title: '',
        issue_number: '',
        description: '',
        total_pages: '',
        status: 'draft',
      });
      setCoverImage(null);
      setPdfFile(null);
      fetchMagazines();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const { error } = await supabase
        .from('magazines')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchMagazines();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading magazines...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-600">Manage Magazines</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Add New Magazine
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {magazines.map((magazine) => (
          <div
            key={magazine.id}
            className="bg-black border border-red-900 rounded-lg overflow-hidden"
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
              <p className="text-gray-400 mb-4">{magazine.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded ${
                  magazine.status === 'published' ? 'bg-green-900/50 text-green-200' : 'bg-yellow-900/50 text-yellow-200'
                }`}>
                  {magazine.status}
                </span>
                {magazine.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(magazine.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-black border border-red-900 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Add New Magazine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Issue Number
                </label>
                <input
                  type="number"
                  value={formData.issue_number}
                  onChange={(e) => setFormData({ ...formData, issue_number: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Total Pages
                </label>
                <input
                  type="number"
                  value={formData.total_pages}
                  onChange={(e) => setFormData({ ...formData, total_pages: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as MagazineStatus })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-700 text-white rounded hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Add Magazine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 