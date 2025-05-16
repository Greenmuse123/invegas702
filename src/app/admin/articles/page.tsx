'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../components/Providers';
import AdminProtected from '../../../components/AdminProtected';

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
  is_featured: boolean;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { supabase } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // Use the authenticated supabase client for fetching articles
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
      if (!confirm('Are you sure you want to delete this article?')) {
        return;
      }
      
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
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-red-600">Manage Articles</h1>
          <Link
            href="/admin/articles/new"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
          >
            Add New Article
          </Link>
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
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-400 mb-2">{article.author}</p>
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      article.status === 'published'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}
                  >
                    {article.status}
                  </span>
                  {article.is_featured && (
                    <span className="px-2 py-1 rounded text-sm bg-blue-900/50 text-blue-400">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  {article.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(article.id)}
                      className="text-green-500 hover:text-green-400"
                    >
                      Publish
                    </button>
                  )}
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-red-600 hover:text-red-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminProtected>
  );
}