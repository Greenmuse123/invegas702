'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  image_url: string | null;
  is_featured: boolean;
  status: 'draft' | 'published';
}

export default function EditArticle({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setArticle(data);
      if (data.image_url) {
        setPreviewUrl(data.image_url);
      }
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!article) return;

    setIsSubmitting(true);
    try {
      let imageUrl = article.image_url;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) throw new Error('Failed to upload image');
        const data = await response.json();
        imageUrl = data.url;
      }

      const { error } = await supabase
        .from('articles')
        .update({
          ...article,
          image_url: imageUrl,
        })
        .eq('id', params.id);

      if (error) throw error;
      router.push('/admin/articles');
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
              onChange={(e) => setArticle(prev => prev ? {
                ...prev,
                status: e.target.value as 'draft' | 'published'
              } : null)}
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