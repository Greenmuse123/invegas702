'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: string;
  status: 'draft' | 'published';
  is_featured: boolean;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!params.id) {
      setError('Article ID is missing');
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', params.id)
          .eq('status', 'published')
          .single();

        if (error) throw error;
        if (!data) throw new Error('Article not found');

        setArticle(data);

        // Fetch related articles (excluding current one)
        const { data: relatedData, error: relatedError } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'published')
          .neq('id', params.id)
          .limit(3)
          .order('created_at', { ascending: false });

        if (!relatedError && relatedData) {
          setRelatedArticles(relatedData);
        }
      } catch (err: any) {
        console.error('Error fetching article:', err);
        setError(err.message || 'Error loading article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-red-600 text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-300 mb-6">{error || 'Article not found'}</p>
        <Link 
          href="/articles" 
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Back to Articles
        </Link>
      </div>
    );
  }

  // Format the date
  const formattedDate = article.created_at 
    ? format(new Date(article.created_at), 'MMMM d, yyyy') 
    : '';

  // Process article content for paragraphs
  const paragraphs = article.content.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero section with image */}
      <div className="w-full relative h-[50vh] md:h-[70vh] bg-gradient-to-b from-transparent to-black">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Title overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full h-full absolute bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="w-full h-full absolute bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>
          
          <div className="relative w-full max-w-5xl mx-auto px-8 py-10 text-center z-20">
            {article.is_featured && (
              <div className="mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-red-600 text-white font-bold uppercase text-xs tracking-wider rounded-sm">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              </div>
            )}
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight">{article.title}</h1>
              
              <div className="flex items-center justify-center gap-6 text-white">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg">
                    {article.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="ml-3 font-medium">{article.author}</span>
                </div>
                <span className="hidden md:block text-white/60">|</span>
                <span className="text-white/70 font-light">{formattedDate}</span>
              </div>
            </div>
            
            <div className="mt-8 md:mt-12">
              <a href="#content" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div id="content" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              {/* Article content */}
              <article className="prose prose-lg max-w-none">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-gray-100 leading-relaxed text-lg mb-6">
                    {paragraph}
                  </p>
                ))}
              </article>
              
              {/* Tags */}
              <div className="mt-10 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-sm">Las Vegas</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-sm">Business</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-sm">Entertainment</span>
              </div>
              
              {/* Social share buttons */}
              <div className="mt-10 flex items-center gap-4 py-6 border-t border-b border-gray-800">
                <span className="text-gray-400 text-sm uppercase tracking-wider">Share:</span>
                <button 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  aria-label="Share on Twitter"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 5.89c-.8.36-1.65.6-2.53.71.91-.54 1.6-1.4 1.93-2.43-.85.5-1.8.87-2.8 1.07a4.32 4.32 0 0 0-7.47 2.96c0 .34.04.67.1.99-3.58-.18-6.78-1.9-8.92-4.52a4.32 4.32 0 0 0 1.34 5.77c-.71-.02-1.37-.22-1.95-.54v.05a4.32 4.32 0 0 0 3.45 4.24 4.3 4.3 0 0 1-1.95.07 4.32 4.32 0 0 0 4.03 3c-1.47 1.15-3.33 1.84-5.35 1.84-.35 0-.68-.02-1.02-.06A12.12 12.12 0 0 0 8.51 21c8.23 0 12.74-6.82 12.74-12.74 0-.19 0-.39-.01-.58.87-.63 1.63-1.41 2.23-2.31l.03-.48z" />
                  </svg>
                </button>
                <button 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  aria-label="Share on Facebook"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 12.05a8 8 0 1 0-9.25 8v-5.67h-2v-2.33h2v-1.77a2.83 2.83 0 0 1 3-3.11c.6 0 1.22.07 1.83.14v2.13h-1.01a1.16 1.16 0 0 0-1.3 1.26v1.35h2.22l-.35 2.33h-1.87v5.67A8 8 0 0 0 20 12.05z" />
                  </svg>
                </button>
                <button 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  aria-label="Share on LinkedIn"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.04 21.97h-3.15v-4.94c0-1.17-.03-2.69-1.64-2.69-1.64 0-1.9 1.28-1.9 2.6v5.02H7.2V9.6h3.02v1.38h.04c.42-.8 1.45-1.64 2.99-1.64 3.2 0 3.79 2.1 3.79 4.84v7.8zM4.17 8.22a1.83 1.83 0 1 1 0-3.66 1.83 1.83 0 0 1 0 3.66zM2.6 21.97h3.16V9.6H2.6v12.38z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="md:w-1/4">
              {/* Author sidebar */}
              <div className="bg-gray-900 p-6 rounded-md">
                <h3 className="text-lg font-bold text-white mb-4">About the Author</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xl">
                    {article.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">{article.author}</p>
                    <p className="text-gray-400 text-sm">Contributor</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Expert writer covering Las Vegas business, entertainment, and lifestyle topics.</p>
              </div>
              
              {/* Newsletter signup */}
              <div className="bg-gray-900 p-6 rounded-md mt-6">
                <h3 className="text-lg font-bold text-white mb-4">Subscribe</h3>
                <p className="text-gray-300 text-sm mb-4">Get the latest from InVegas702 delivered to your inbox.</p>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-sm mb-2"
                />
                <button className="w-full bg-red-600 text-white py-2 font-medium rounded-sm hover:bg-red-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-center mb-12">
              <div className="w-12 h-1 bg-red-600"></div>
              <h2 className="text-3xl font-bold text-white mx-4">More Articles</h2>
              <div className="w-12 h-1 bg-red-600"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(related => (
                <div key={related.id} className="bg-gray-900 rounded-lg overflow-hidden group hover:bg-gray-800 transition">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={related.image_url || '/placeholder.svg'}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white line-clamp-2">{related.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">By {related.author}</p>
                    <p className="text-gray-300 mb-4 line-clamp-2">{related.content}</p>
                    <Link
                      href={`/articles/${related.id}`}
                      className="text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                    >
                      Read More 
                      <svg 
                        width="20" 
                        height="20" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor" 
                        className="ml-1"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to articles */}
        <div className="flex justify-center mt-16">
          <Link 
            href="/articles" 
            className="px-8 py-3 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition flex items-center group"
          >
            <svg 
              width="20" 
              height="20" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
