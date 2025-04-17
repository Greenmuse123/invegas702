'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { supabase, BUCKETS, uploadFile } from '../../../lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

type ArticleStatus = 'draft' | 'published';

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  magazine_id: string | null;
  status: ArticleStatus;
  published_at: string | null;
  image_url: string | null;
}

interface Magazine {
  id: string;
  title: string;
}

// @ts-ignore: Interface is used for type checking form state
interface FormData {
  title: string;
  content: string;
  author: string;
  magazine_id: string;
  status: ArticleStatus;
  is_featured: boolean;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    magazine_id: '',
    status: 'draft' as ArticleStatus,
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchMagazines();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMagazines = async () => {
    try {
      const { data, error } = await supabase
        .from('magazines')
        .select('id, title')
        .eq('status', 'published');

      if (error) throw error;
      setMagazines(data || []);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const { data: imageData, error: imageError } = await uploadFile(
          BUCKETS.ARTICLES,
          imageFile,
          `images/${Date.now()}-${imageFile.name}`
        );
        if (imageError) throw imageError;
        if (imageData?.path) {
          imageUrl = imageData.path;
        }
      }

      const { error } = await supabase.from('articles').insert({
        ...formData,
        image_url: imageUrl,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        magazine_id: formData.magazine_id || null,
      });

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        title: '',
        content: '',
        author: '',
        magazine_id: '',
        status: 'draft',
        is_featured: false,
      });
      setImageFile(null);
      fetchArticles();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      fetchArticles();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchArticles();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-600">Manage Articles</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Add New Article
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-black border border-red-900 rounded-lg overflow-hidden"
          >
            {article.image_url && (
              <div className="relative h-48">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold text-red-600 mb-2">{article.title}</h2>
              <p className="text-gray-300 mb-2">By {article.author}</p>
              <p className="text-gray-400 mb-4 line-clamp-3">{article.content}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded ${
                  article.status === 'published' ? 'bg-green-900/50 text-green-200' : 'bg-yellow-900/50 text-yellow-200'
                }`}>
                  {article.status}
                </span>
                {article.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(article.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Publish
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(article.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-black border border-red-900 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Add New Article</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  name="title"
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={handleChange}
                  name="author"
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Magazine (Optional)
                </label>
                <select
                  value={formData.magazine_id}
                  onChange={handleChange}
                  name="magazine_id"
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                >
                  <option value="">Select a magazine</option>
                  {magazines.map((magazine) => (
                    <option key={magazine.id} value={magazine.id}>
                      {magazine.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={handleChange}
                  name="content"
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={handleChange}
                  name="status"
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
                  {uploading ? 'Uploading...' : 'Add Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 