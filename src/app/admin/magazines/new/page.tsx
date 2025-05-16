'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProtected from '../../../../components/AdminProtected';
import { useAuth } from '../../../../components/Providers';

interface FormData {
  title: string;
  description: string;
  issue_number: number;
  pdf_file: File | null;
  teaser_file: File | null;
}

export default function NewMagazinePage() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    issue_number: 1,
    pdf_file: null,
    teaser_file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use context for session and admin status
  const { session, isAdmin, supabase } = useAuth();
  const verifiedUser = session?.user;

  console.log('Supabase Session:', session);
  console.log('Supabase Verified User:', verifiedUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (!formData.pdf_file) {
        throw new Error('Please select a PDF file');
      }
      if (!formData.teaser_file) {
        throw new Error('Please select a teaser image');
      }
      const user = verifiedUser;
      if (!user || !user.id) {
        throw new Error('You must be logged in as an admin to upload a magazine.');
      }
      if (!isAdmin) {
        throw new Error('You do not have admin privileges.');
      }
      const timestamp = Date.now();
      const pdfFileName = `${timestamp}-${formData.pdf_file.name.replace(/\s+/g, '_')}`;
      const pdfStoragePath = `magazines/${pdfFileName}`;
      // Upload PDF
      const { error: uploadError } = await supabase
        .storage
        .from('magazines-storage')
        .upload(pdfStoragePath, formData.pdf_file, {
          cacheControl: '3600',
          upsert: false,
        });
      if (uploadError) {
        throw new Error(`Failed to upload PDF: ${uploadError.message}`);
      }
      // Upload teaser image (to public bucket or public folder)
      const teaserFileName = `${timestamp}-${formData.teaser_file.name.replace(/\s+/g, '_')}`;
      const teaserStoragePath = `teasers/${teaserFileName}`;
      const { error: teaserUploadError } = await supabase
        .storage
        .from('magazines-storage')
        .upload(teaserStoragePath, formData.teaser_file, {
          cacheControl: '3600',
          upsert: false,
        });
      if (teaserUploadError) {
        throw new Error(`Failed to upload teaser image: ${teaserUploadError.message}`);
      }
      // Insert magazine record (now with teaser_image_url)
      const { error: dbError } = await supabase
        .from('magazines')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            issue_number: formData.issue_number,
            pdf_url: pdfStoragePath,
            teaser_image_url: teaserStoragePath,
            status: 'draft',
            created_by: user.id
          }
        ]);
      if (dbError) {
        throw new Error(`Failed to create magazine: ${dbError.message}`);
      }
      router.push('/magazines');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create magazine');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminProtected>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">New Magazine Issue</h1>
            <Link
              href="/magazines"
              className="btn btn-secondary"
            >
              Back to Magazines
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Number
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.issue_number}
                onChange={(e) => setFormData(prev => ({ ...prev, issue_number: parseInt(e.target.value) }))}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => setFormData(prev => ({ ...prev, pdf_file: e.target.files?.[0] || null }))}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teaser Image (cover/first page, PNG or JPG)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                required
                onChange={(e) => setFormData(prev => ({ ...prev, teaser_file: e.target.files?.[0] || null }))}
                className="input"
              />
              {formData.teaser_file && (
                <div className="my-2">
                  <label className="block text-xs text-gray-500 mb-1">Teaser Preview:</label>
                  <img
                    src={URL.createObjectURL(formData.teaser_file)}
                    alt="Teaser preview"
                    className="border rounded shadow max-w-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Magazine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminProtected>
  );
}