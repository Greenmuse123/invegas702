'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { BUCKETS } from '@/lib/constants';
import { useAuth } from '@/components/Providers';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  image_url: string | null;
  is_featured: boolean;
  status: 'draft' | 'published';
  magazine_id: string | null;
  published_at: string | null;
  category: string;
}

export default function EditArticle({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { supabase: authSupabase } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      // Use the authenticated client if available, otherwise fall back to the regular client
      const client = authSupabase || supabase;
      
      const { data, error } = await client
        .from('articles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setArticle(data);
      if (data.image_url) {
        setPreviewUrl(data.image_url);
      }
    } catch (error: any) {
      console.error('Error fetching article:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Make sure we have an authenticated Supabase client
      if (!authSupabase) {
        throw new Error('Authentication required');
      }
      
      let imageUrl = article.image_url;

      if (imageFile) {
        // Create FormData for image upload
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('bucket', BUCKETS.ARTICLES);
        
        console.log('Uploading image with bucket:', BUCKETS.ARTICLES);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }
        
        const data = await response.json();
        console.log('Upload response:', data);
        imageUrl = data.url;
      }

      console.log('Updating article with image URL:', imageUrl);

      // Use the authenticated client for database updates
      const { error } = await authSupabase
        .from('articles')
        .update({
          title: article.title,
          content: article.content,
          author: article.author,
          image_url: imageUrl,
          is_featured: article.is_featured,
          status: article.status,
          published_at: article.status === 'published' ? 
            (article.published_at || new Date().toISOString()) : 
            article.published_at,
          magazine_id: article.magazine_id,
          category: article.category || 'general'
        })
        .eq('id', params.id);

      if (error) throw error;
      
      // Add a small delay to ensure the database update completes
      setTimeout(() => {
        router.push('/admin/articles');
      }, 500);
      
    } catch (error: any) {
      console.error('Error updating article:', error);
      setError(error.message || 'Failed to update article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setArticle(prev => prev ? {
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    } : null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!article) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Article not found</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Edit Article</h1>
        
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
              value={article.title}
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
              value={article.author}
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
              value={article.category || ''}
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

          {/* Featured Article */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={article.is_featured}
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
              value={article.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={article.status}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
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