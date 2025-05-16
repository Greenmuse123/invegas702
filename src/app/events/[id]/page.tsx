'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string | null;
  status: 'draft' | 'published';
}

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!params.id) {
      setError('Event ID is missing');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', params.id)
          .eq('status', 'published')
          .single();

        if (error) throw error;
        if (!data) throw new Error('Event not found');

        setEvent(data);

        // Fetch related events (upcoming events, excluding current one)
        const { data: relatedData, error: relatedError } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'published')
          .neq('id', params.id)
          .gt('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(3);

        if (relatedError) throw relatedError;
        setRelatedEvents(relatedData || []);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id, supabase]);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-xl mb-8">{error || 'Event not found'}</p>
          <Link href="/events" className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy h:mm a');
  };

  const paragraphs = event.description.split('\n').filter(p => p.trim() !== '');

  const formattedStartDate = formatDateTime(event.start_date);
  const formattedEndDate = event.end_date ? formatDateTime(event.end_date) : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Image */}
      <div className="relative h-[70vh] w-full">
        <Image
          src={event.image_url || '/placeholder.jpg'}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />
        
        {/* Title overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full h-full absolute bg-gradient-to-t from-black via-black/70 to-transparent"></div>
          <div className="w-full h-full absolute bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>
          
          <div className="relative w-full max-w-5xl mx-auto px-8 py-10 text-center z-20">            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-none tracking-tight">{event.title}</h1>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-white">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">{formattedStartDate}</span>
                </div>
                
                {formattedEndDate && formattedEndDate !== formattedStartDate && (
                  <>
                    <span className="hidden md:block text-white/60">|</span>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{formattedEndDate}</span>
                    </div>
                  </>
                )}
                
                <span className="hidden md:block text-white/60">|</span>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">{event.location}</span>
                </div>
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

      {/* Event content */}
      <div id="content" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/4">
              {/* Event content */}
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
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-sm">Entertainment</span>
                <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-sm">Events</span>
              </div>
              
              {/* Social share buttons */}
              <div className="mt-10 flex items-center gap-4 py-6 border-t border-b border-gray-800">
                <span className="text-gray-400 text-sm uppercase tracking-wider">Share:</span>
                <button 
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(event.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
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
              {/* Event details sidebar */}
              <div className="bg-gray-900 p-6 rounded-md">
                <h3 className="text-lg font-bold text-white mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-sm">Date & Time:</p>
                    <p className="text-white">{formattedStartDate}</p>
                    {formattedEndDate && formattedEndDate !== formattedStartDate && (
                      <p className="text-white">to {formattedEndDate}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Location:</p>
                    <p className="text-white">{event.location}</p>
                  </div>
                </div>
              </div>
              
              {/* Newsletter signup */}
              <div className="bg-gray-900 p-6 rounded-md mt-6">
                <h3 className="text-lg font-bold text-white mb-4">Subscribe</h3>
                <p className="text-gray-300 text-sm mb-4">Get the latest events in Las Vegas delivered to your inbox.</p>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full py-2 px-3 bg-gray-800 border border-gray-700 rounded-md text-white text-sm mb-3"
                />
                <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.map((relatedEvent) => (
                  <Link
                    href={`/events/${relatedEvent.id}`}
                    key={relatedEvent.id}
                    className="bg-gray-900 rounded-lg overflow-hidden transform transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-48">
                      <Image
                        src={relatedEvent.image_url || '/placeholder.jpg'}
                        alt={relatedEvent.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{relatedEvent.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {format(new Date(relatedEvent.start_date), 'MMMM d, yyyy')}
                      </p>
                      <p className="text-sm text-gray-300 line-clamp-2">{relatedEvent.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}