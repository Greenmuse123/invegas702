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
  // Function to get formatted date for events
  const formatEventDate = (event: Event) => {
    const date = new Date(event.start_date);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <div className="absolute top-0 right-0 w-2/3 h-screen bg-gradient-to-bl from-red-900/40 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-screen bg-gradient-to-tr from-red-900/40 via-transparent to-transparent"></div>
        <div className="absolute inset-0">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 0, 0, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 0, 0, 0.1) 2%, transparent 0%)', backgroundSize: '100px 100px' }}></div>
        </div>
      </div>

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
                    className="bg-red-600/90 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 hover:shadow-lg hover:shadow-red-600/30 whitespace-nowrap"
                  >
                    Latest Issue
                  </Link>
                  <Link
                    href="/articles"
                    className="bg-transparent hover:bg-red-900/20 text-red-400 font-bold py-3 px-6 rounded-lg transition duration-300 border border-red-500/30 hover:border-red-500/50 whitespace-nowrap"
                  >
                    Explore Articles
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Content */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors duration-300 group">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">Latest Events</h3>
                  <p className="text-gray-300">Discover upcoming shows and experiences</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors duration-300 group">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">Featured Articles</h3>
                  <p className="text-gray-300">Read our latest stories and guides</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors duration-300 group">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">Local Insights</h3>
                  <p className="text-gray-300">Get the inside scoop from locals</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-red-500/30 transition-colors duration-300 group">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-400 transition-colors">Exclusive Deals</h3>
                  <p className="text-gray-300">Find special offers and discounts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Magazine Section - Premium Showcase */}
      {latestMagazine && (
        <section className="py-20 relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/subtle-pattern.png')] bg-repeat opacity-5"></div>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-900/10 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-red-900/10 to-transparent"></div>
          
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 left-1/4 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-float-slow"></div>
            <div className="absolute top-1/4 right-1/3 w-3 h-3 bg-red-400 rounded-full opacity-40 animate-float-medium"></div>
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-red-600 rounded-full opacity-50 animate-float-fast"></div>
            <div className="absolute bottom-10 right-1/4 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-float-slow"></div>
          </div>
          
          <div className="container mx-auto px-4 relative">
            {/* Premium Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center space-x-2 mb-3">
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-red-500"></div>
                <span className="text-red-500 font-light tracking-widest uppercase text-sm">Premium Edition</span>
                <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-red-500"></div>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white leading-tight">
                Latest Magazine
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">Experience luxury in print form with our latest edition, featuring exclusive content and stunning visuals</p>
            </div>
          
            <div className="max-w-7xl mx-auto">
              {/* 3D Magazine Showcase */}
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                {/* 3D Magazine Cover */}
                <div className="lg:w-1/2 relative">
                  <div className="relative group perspective">
                    {/* 3D Book Effect Wrapper */}
                    <div className="relative preserve-3d group-hover:rotate-y-[-25deg] transition-transform duration-1000 shadow-2xl shadow-red-900/30 max-w-md mx-auto">
                      {/* Front Cover */}
                      <div className="aspect-[3/4] w-full relative rounded-r-lg rounded-l-sm overflow-hidden bg-gray-900 border-l border-t border-b border-gray-700">
                        <Image
                          src={latestMagazine.teaser_image_url || latestMagazine.image_url || '/placeholder.svg'}
                          alt={latestMagazine.title}
                          fill
                          priority
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                        
                        {/* Reflective Glare Effect */}
                        <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-transparent via-white to-transparent group-hover:opacity-50 transition-opacity duration-1000 blur-md"></div>
                        
                        {/* Premium Badge */}
                        <div className="absolute top-6 right-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg shadow-red-900/30 text-sm tracking-wider transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                          ISSUE {latestMagazine.issue_number || 'NEW'}
                        </div>
                      </div>

                      {/* Spine */}
                      <div className="absolute top-0 bottom-0 right-full w-[20px] bg-gradient-to-l from-gray-800 to-gray-900 transform origin-right rotate-y-[90deg] translate-x-[10px] border border-gray-700"></div>
                      
                      {/* Shadow under the magazine */}
                      <div className="absolute w-full h-[20px] bg-gradient-to-b from-black/50 to-transparent blur-md -bottom-5 rounded-full"></div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse-slow"></div>
                    <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-red-500/10 rounded-full blur-xl animate-pulse-medium"></div>
                  </div>
                </div>
                
                {/* Magazine Details */}
                <div className="lg:w-1/2 text-center lg:text-left">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black/40 backdrop-blur-xl border border-gray-800 rounded-full mb-6 group-hover:border-red-500/50 transition-colors">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-red-400 uppercase tracking-wider">Exclusive Release</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold mb-6 text-white leading-tight">
                    {latestMagazine.title}
                  </h2>
                  
                  <div className="mb-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                    <span className="px-3 py-1 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-gray-700">Art & Culture</span>
                    <span className="px-3 py-1 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-gray-700">Las Vegas</span>
                    <span className="px-3 py-1 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-gray-700">Entertainment</span>
                  </div>
                  
                  <p className="text-gray-300 mb-8 leading-relaxed backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-gray-800 max-w-xl mx-auto lg:mx-0">
                    {latestMagazine.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                    <Link
                      href={`/magazines/${latestMagazine.id}`}
                      className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-500 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center shadow-lg shadow-red-900/30"
                    >
                      {/* Button Background Animation */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 w-full h-full bg-[url('/images/subtle-pattern.png')] bg-repeat opacity-5"></div>
                      
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out"></div>
                      
                      <span className="relative flex items-center">
                        <span className="mr-2">Experience Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </Link>
                    
                    <Link
                      href="/magazines"
                      className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center transition-all hover:border-red-500/30 hover:bg-white/10"
                    >
                      <span className="relative">Browse All Issues</span>
                    </Link>
                  </div>
                  
                  {/* Extra Details */}
                  <div className="mt-10 pt-6 border-t border-gray-800 grid grid-cols-2 md:grid-cols-3 gap-6 text-center max-w-xl mx-auto lg:mx-0">
                    <div className="group">
                      <div className="text-red-500 mb-1 transform group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-400 group-hover:text-white transition-colors">48 Pages</div>
                    </div>
                    
                    <div className="group">
                      <div className="text-red-500 mb-1 transform group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 015-5h14a2 2 0 012 2v1" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-400 group-hover:text-white transition-colors">April 2023</div>
                    </div>
                    
                    <div className="group col-span-2 md:col-span-1">
                      <div className="text-red-500 mb-1 transform group-hover:scale-110 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div className="text-sm text-gray-400 group-hover:text-white transition-colors">1.2K+ Reads</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events Section */}
      <section className="py-16 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/subtle-pattern.png')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-red-900/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-900/10 to-transparent"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/5 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-float-medium"></div>
          <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-red-400 rounded-full opacity-40 animate-float-slow"></div>
          <div className="absolute bottom-1/4 left-2/3 w-2 h-2 bg-red-600 rounded-full opacity-50 animate-float-fast"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Premium Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-red-500"></div>
              <span className="text-red-500 font-light tracking-widest uppercase text-sm">What's Happening</span>
              <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white leading-tight">
              Upcoming Events
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Discover exclusive experiences and must-attend happenings around Las Vegas</p>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="relative max-w-2xl mx-auto backdrop-blur-sm bg-black/40 rounded-xl p-12 border border-gray-800/50 overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-40 h-40 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors duration-700"></div>
              <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors duration-700"></div>
              
              <div className="text-center flex flex-col items-center justify-center relative">
                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-red-900/30 to-red-700/10 flex items-center justify-center backdrop-blur-sm border border-red-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 015-5h14a2 2 0 012 2v1" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">No Upcoming Events</h3>
                <p className="text-gray-300 max-w-md mb-8">We're planning exciting new events for you. Check back soon or subscribe to our newsletter for updates.</p>
                <Link href="/events" className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center transition-all hover:border-red-500/30 hover:bg-white/10">
                  <span className="relative flex items-center">
                    <span className="mr-2">View Past Events</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group relative flex flex-col bg-gradient-to-br from-gray-900/80 to-black/60 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-red-900/20 transition-all duration-500 hover:-translate-y-2 border border-gray-800/50 hover:border-red-500/30 h-full transform perspective"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500 group-hover:animate-pulse-slow"></div>
                  
                  {/* Event Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-b from-red-900/20 to-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Event Date Badge */}
                    <div className="absolute top-4 left-4 z-20 transform group-hover:-translate-y-1 transition-transform duration-300">
                      <div className="bg-black/80 backdrop-blur-md rounded-lg overflow-hidden border border-red-500/40 shadow-lg shadow-black/50 group-hover:border-red-500/60 transition-colors duration-300">
                        <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold py-1 px-3 text-center uppercase">
                          {formatEventDate(event).month}
                        </div>
                        <div className="text-white text-center font-bold text-xl py-1 px-3">
                          {formatEventDate(event).day}
                        </div>
                      </div>
                    </div>
                    
                    {/* Event Status Badge */}
                    {getEventStatus(event) && (
                      <div className="absolute top-4 right-4 z-20 transform group-hover:-translate-y-1 transition-transform duration-300">
                        <div className="bg-gradient-to-r from-green-600 to-green-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg shadow-black/50">
                          {getEventStatus(event)}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Event Info */}
                  <div className="p-6 flex-1 flex flex-col relative">
                    {/* Subtle accent line */}
                    <div className="absolute left-6 top-0 h-[2px] w-12 bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
                    
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-800/50 flex items-center text-red-400 text-sm font-medium group-hover:text-red-300 transition-colors duration-300">
                      <span className="mr-2">View Details</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* View All Link - Centered */}
          {upcomingEvents.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                href="/events"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium rounded-lg transition-all hover:border-red-500/30 hover:bg-white/10"
              >
                <span className="mr-2">View All Events</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/subtle-pattern.png')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-900/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-red-900/10 to-transparent"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-float-slow"></div>
          <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-red-400 rounded-full opacity-40 animate-float-medium"></div>
          <div className="absolute top-2/3 right-1/2 w-2 h-2 bg-red-600 rounded-full opacity-50 animate-float-fast"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Premium Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-red-500"></div>
              <span className="text-red-500 font-light tracking-widest uppercase text-sm">Curated Content</span>
              <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white leading-tight">
              Featured Articles
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Explore our handpicked stories showcasing the best of Las Vegas culture and lifestyle</p>
          </div>

          {featuredArticles.length === 0 ? (
            <div className="relative max-w-2xl mx-auto backdrop-blur-sm bg-black/40 rounded-xl p-12 border border-gray-800/50 overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-40 h-40 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors duration-700"></div>
              <div className="absolute -bottom-24 -left-24 w-40 h-40 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors duration-700"></div>
              
              <div className="text-center flex flex-col items-center justify-center relative">
                <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-red-900/30 to-red-700/10 flex items-center justify-center backdrop-blur-sm border border-red-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">No Featured Articles</h3>
                <p className="text-gray-300 max-w-md mb-8">Our editorial team is crafting amazing content. Check back soon for featured articles.</p>
                <Link href="/articles" className="group relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center transition-all hover:border-red-500/30 hover:bg-white/10">
                  <span className="relative flex items-center">
                    <span className="mr-2">Browse Articles</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <Link 
                  key={article.id} 
                  href={`/articles/${article.id}`}
                  className="group relative flex flex-col bg-gradient-to-br from-gray-900/80 to-black/60 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-red-900/20 transition-all duration-500 hover:-translate-y-2 border border-gray-800/50 hover:border-red-500/30 h-full transform perspective"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500 group-hover:animate-pulse-slow"></div>
                  
                  <div className="relative aspect-video overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                    <Image
                      src={article.image_url || '/placeholder.svg'}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 z-20 transform group-hover:-translate-y-1 transition-transform duration-300">
                      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg shadow-black/50">
                        Featured
                      </div>
                    </div>
                    
                    {/* Reflective Glare Effect */}
                    <div className="absolute inset-0 opacity-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent group-hover:opacity-100 transition-opacity duration-1000 blur-md"></div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col relative">
                    {/* Subtle accent line */}
                    <div className="absolute left-6 top-0 h-[2px] w-12 bg-gradient-to-r from-red-500 to-transparent rounded-full"></div>
                    
                    <div className="flex items-center mb-3">
                      <span className="text-gray-300 text-xs">By {article.author}</span>
                      <span className="mx-2 text-gray-600 text-xs">•</span>
                      <span className="text-gray-300 text-xs">
                        {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{article.content}</p>
                    
                    <div className="mt-auto pt-4 border-t border-gray-800/50 flex items-center text-red-400 text-sm font-medium group-hover:text-red-300 transition-colors duration-300">
                      <span className="mr-2">Read Article</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {/* View All Link - Centered */}
          {featuredArticles.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                href="/articles"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium rounded-lg transition-all hover:border-red-500/30 hover:bg-white/10"
              >
                <span className="mr-2">View All Articles</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/subtle-pattern.png')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-900/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-red-900/10 to-transparent"></div>
        
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/5 right-1/4 w-2 h-2 bg-red-500 rounded-full opacity-60 animate-float-slow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-red-400 rounded-full opacity-40 animate-float-medium"></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-red-600 rounded-full opacity-50 animate-float-fast"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Premium Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center space-x-2 mb-3">
              <div className="w-10 h-[1px] bg-gradient-to-r from-transparent to-red-500"></div>
              <span className="text-red-500 font-light tracking-widest uppercase text-sm">Join Our Community</span>
              <div className="w-10 h-[1px] bg-gradient-to-l from-transparent to-red-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white leading-tight">
              Stay Connected
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Get exclusive content, event invitations, and insider tips about Las Vegas delivered to your inbox</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative backdrop-blur-md bg-gradient-to-br from-gray-900/80 to-black/60 rounded-2xl overflow-hidden border border-gray-800/50 group hover:border-red-500/30 transition-colors duration-500">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-900/20 rounded-full blur-3xl opacity-60 group-hover:bg-red-900/30 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-900/20 rounded-full blur-3xl opacity-60 group-hover:bg-red-900/30 transition-colors duration-700"></div>
              <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-24 h-24 bg-red-500/10 rounded-full blur-xl animate-pulse-slow"></div>
              <div className="absolute -left-12 top-1/3 w-20 h-20 bg-red-500/10 rounded-full blur-xl animate-pulse-medium"></div>
              
              {/* Content */}
              <div className="relative z-10 px-8 py-14 md:p-14 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-900/30 mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      Newsletter
                    </h3>
                  </div>
                  
                  <p className="text-gray-200 mb-8 leading-relaxed">
                    Subscribe to our newsletter for exclusive content, event invitations, and insider tips about Las Vegas that you won't find anywhere else.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">Early access to new magazine issues</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">Exclusive event invitations</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-sm">Special offers from local partners</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mt-8">
                    <a href="#" className="group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-red-500/30 group-hover:bg-white/10 transition-all">
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                        </svg>
                      </div>
                    </a>
                    <a href="#" className="group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-red-500/30 group-hover:bg-white/10 transition-all">
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                        </svg>
                      </div>
                    </a>
                    <a href="#" className="group">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-red-500/30 group-hover:bg-white/10 transition-all">
                        <svg className="h-5 w-5 text-gray-400 group-hover:text-red-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>
                
                <div className="md:w-1/2 w-full">
                  <form className="relative">
                    <div className="relative mb-5 group">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-5 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 focus:border-red-500/50 text-white focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all"
                      />
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-300"></div>
                    </div>
                    
                    <div className="relative mb-5 group">
                      <input
                        type="email"
                        placeholder="Your Email Address"
                        className="w-full px-5 py-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 focus:border-red-500/50 text-white focus:outline-none focus:ring-1 focus:ring-red-500/30 transition-all"
                      />
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-red-500 to-red-600 group-hover:w-full transition-all duration-300"></div>
                    </div>
                    
                    <button
                      type="submit"
                      className="group relative overflow-hidden w-full bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-4 rounded-lg font-medium hover:shadow-lg hover:shadow-red-600/20 transition-all duration-300"
                    >
                      {/* Button Background Animation */}
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute inset-0 w-full h-full bg-[url('/images/subtle-pattern.png')] bg-repeat opacity-5"></div>
                      
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-in-out"></div>
                      
                      <span className="relative flex items-center justify-center">
                        <span className="mr-2">Subscribe Now</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </button>
                    
                    <p className="text-gray-400 text-xs mt-4 text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}