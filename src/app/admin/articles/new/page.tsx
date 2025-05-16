'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BUCKETS } from '@/lib/constants';
import Image from 'next/image';
import { useAuth } from '@/components/Providers';

interface FormData {
  title: string;
  content: string;
  author: string;
  category: string;
  is_featured: boolean;
  status: 'draft' | 'published';
}

export default function NewArticle() {
  const router = useRouter();
  const { supabase: authSupabase } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    author: '',
    category: 'general',
    is_featured: false,
    status: 'draft'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Make sure we have an authenticated Supabase client
      if (!authSupabase) {
        throw new Error('Authentication required');
      }

      let imageUrl = null;

      // Handle image upload if there is one
      if (imageFile) {
        const formDataToSend = new FormData();
        formDataToSend.append('file', imageFile);
        formDataToSend.append('bucket', BUCKETS.ARTICLES);

        console.log('Uploading image with bucket:', BUCKETS.ARTICLES);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        console.log('Upload response:', uploadData);
        imageUrl = uploadData.url;
      }

      // Insert article into database using authenticated client
      const { data, error: insertError } = await authSupabase
        .from('articles')
        .insert({
          title: formData.title,
          content: formData.content,
          author: formData.author,
          category: formData.category,
          is_featured: formData.is_featured,
          status: formData.status,
          published_at: formData.status === 'published' ? new Date().toISOString() : null,
          image_url: imageUrl
        })
        .select();

      if (insertError) throw insertError;

      console.log('Article created:', data);
      
      // Add a small delay to ensure the database update completes
      setTimeout(() => {
        router.push('/admin/articles');
      }, 500);
    } catch (error: any) {
      console.error('Error creating article:', error);
      setError(error.message || 'Failed to create article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Create New Article</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Select a category</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="food">Food</option>
              <option value="events">Events</option>
              <option value="business">Business</option>
              <option value="people">People</option>
              <option value="general">General</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Featured Article */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-900 rounded"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-300">
              Feature this article on the home page
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image
            </label>
            {previewUrl && (
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-gray-300"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Article'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/articles')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}