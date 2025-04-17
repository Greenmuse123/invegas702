'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
}

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: string;
  is_featured: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
}

interface HomeContentProps {
  latestMagazine: any;
  upcomingEvents: Event[];
  featuredArticles: Article[];
}

export function HomeContent({ latestMagazine, upcomingEvents, featuredArticles }: HomeContentProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (now < startDate) {
      return 'Upcoming';
    } else if (now >= startDate && now <= endDate) {
      return 'Ongoing';
    }
    return '';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/80 to-black/95 z-10" />
        <Image
          src="/images/las-vegas-680953_1920.jpg"
          alt="Las Vegas Skyline"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Logo and Text */}
            <div className="space-y-8">
              <div className="w-64">
                <Image
                  src="/images/invegas702 logo.png"
                  alt="InVegas702 Logo"
                  width={400}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Experience
                  <span className="block text-red-500">Las Vegas</span>
                  Like Never Before
                </h1>
                <p className="text-xl text-gray-300 max-w-lg">
                  Your insider's guide to the best of Las Vegas. From hidden gems to exclusive events, we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/magazines"
                    className="btn-primary"
                  >
                    Latest Issue
                  </Link>
                  <Link
                    href="/articles"
                    className="btn-secondary"
                  >
                    Explore Articles
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Content */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Latest Events</h3>
                  <p className="text-gray-300">Discover upcoming shows and experiences</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Featured Articles</h3>
                  <p className="text-gray-300">Read our latest stories and guides</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Local Insights</h3>
                  <p className="text-gray-300">Get the inside scoop from locals</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">Exclusive Deals</h3>
                  <p className="text-gray-300">Find special offers and discounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Magazine Section */}
      {latestMagazine && (
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-red-600">Latest Issue</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[3/4]">
                <Image
                  src={latestMagazine.cover_image}
                  alt={latestMagazine.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">{latestMagazine.title}</h3>
                <p className="text-gray-300 mb-6">{latestMagazine.description}</p>
                <Link
                  href={`/magazines/${latestMagazine.id}`}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full inline-block"
                >
                  Read Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-red-600">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-300 text-center">No upcoming events at the moment. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-black p-6 rounded-lg">
                  <div className="relative aspect-video mb-4">
                    <Image
                      src={event.image_url || '/placeholder.svg'}
                      alt={event.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-red-600">{formatDate(event.start_date)}</span>
                      <span className="text-green-500 text-sm font-medium">{getEventStatus(event)}</span>
                    </div>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-red-600 hover:text-red-700"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-red-600">Featured Articles</h2>
          {featuredArticles.length === 0 ? (
            <p className="text-gray-300 text-center">No featured articles at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <div key={article.id} className="bg-gray-900 p-6 rounded-lg">
                  <div className="relative aspect-video mb-4">
                    <Image
                      src={article.image_url || '/placeholder.svg'}
                      alt={article.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{article.title}</h3>
                  <p className="text-gray-400 mb-2">By {article.author}</p>
                  <p className="text-gray-300 mb-4 line-clamp-3">{article.content}</p>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-red-600 hover:text-red-700"
                  >
                    Read More →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-red-600">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest updates, exclusive content, and special offers.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-full bg-black text-white border border-gray-700 focus:border-red-600 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
} 