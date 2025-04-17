'use client';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  excerpt: string
  image: string
  category: string
  date: string
}

const featuredArticles: Article[] = [
  {
    id: '1',
    title: 'The Rise of Las Vegas Nightlife',
    excerpt: 'Discover the hottest spots and trends in Las Vegas nightlife.',
    image: '/images/articles/nightlife.jpg',
    category: 'Nightlife',
    date: 'March 15, 2024',
  },
  {
    id: '2',
    title: 'Fine Dining in Sin City',
    excerpt: 'A guide to the best restaurants and culinary experiences in Las Vegas.',
    image: '/images/articles/dining.jpg',
    category: 'Dining',
    date: 'March 14, 2024',
  },
  {
    id: '3',
    title: 'Entertainment Guide',
    excerpt: 'Your complete guide to shows and entertainment in Las Vegas.',
    image: '/images/articles/entertainment.jpg',
    category: 'Entertainment',
    date: 'March 13, 2024',
  },
]

export function FeaturedArticles() {
  return (
    <section className="py-20 bg-secondary-light">
      <div className="container">
        <h2 className="text-4xl font-serif font-bold mb-12 text-center">
          Featured Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArticles.map((article) => (
            <article
              key={article.id}
              className="bg-secondary rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <div className="relative h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-primary text-sm font-medium">
                    {article.category}
                  </span>
                  <span className="text-gray-400 text-sm">{article.date}</span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2">
                  <Link href={`/articles/${article.id}`} className="hover:text-primary">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-gray-300 mb-4">{article.excerpt}</p>
                <Link
                  href={`/articles/${article.id}`}
                  className="text-primary hover:text-primary-dark font-medium inline-flex items-center"
                >
                  Read More
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
} 