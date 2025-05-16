"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Magazine {
  id: number;
  title: string;
  description: string;
  pdf_url: string;
  teaser_image_url?: string;
  status: "draft" | "published";
  issue_number: number;
  created_at: string;
  updated_at: string;
}

export const MagazineGrid: React.FC<{ magazines: Magazine[] }> = ({ magazines }) => {
  // Format published date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long'
    }).format(date);
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-15">
        <div className="absolute top-0 right-0 w-2/3 h-screen bg-gradient-to-bl from-red-900/40 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-screen bg-gradient-to-tr from-red-900/40 via-transparent to-transparent"></div>
        <div className="absolute inset-0">
          <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 0, 0, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 0, 0, 0.1) 2%, transparent 0%)', backgroundSize: '100px 100px' }}></div>
        </div>
      </div>
      
      {/* Hero Section with Background Image */}
      <section className="relative pt-24 pb-20 mb-12 overflow-hidden z-10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10"></div>
          <Image 
            src="/images/las-vegas-680953_1920.jpg" 
            alt="Las Vegas skyline"
            fill
            priority
            className="object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Magazines</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed [text-shadow:_0_1px_3px_rgba(0,0,0,0.7)]">
              Dive into the latest issues of InVegas702, your premier guide to the heart and soul of Las Vegas.
              Each edition brings you exclusive content showcasing the vibrant life, culture, and entertainment of our city.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full shadow-lg shadow-red-900/30"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 container mx-auto px-4 pb-24">
        {/* Filter/Sort Options - Can be expanded later */}
        <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-200">Latest Editions</h2>
          <div className="flex items-center bg-gray-900/70 p-2 rounded-lg border border-gray-800">
            <span className="text-sm text-gray-400 mr-2">Sort by:</span>
            <select className="bg-transparent text-gray-200 text-sm border-none focus:ring-0 cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="issue">Issue Number</option>
            </select>
          </div>
        </div>
        
        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {magazines.map((magazine) => (
            <Link
              key={magazine.id}
              href={`/magazines/${magazine.id}`}
              className="group relative flex flex-col h-full outline-none"
            >
              {/* Card with parallax effect */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-red-900/10 aspect-[3/4] mb-6 transform transition-all duration-500 group-hover:shadow-red-600/20 group-hover:-translate-y-2">
                {/* Magazine Cover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                
                {magazine.teaser_image_url ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={magazine.teaser_image_url}
                      alt={`Cover of ${magazine.title}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gradient-to-b from-gray-800 to-black">
                    <div className="px-6 py-4 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-900/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <span className="text-gray-400 text-sm">Cover not available</span>
                    </div>
                  </div>
                )}
                
                {/* Issue Badge */}
                <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-500/20">
                  <span className="text-red-500 text-sm font-semibold">Issue #{magazine.issue_number}</span>
                </div>
                
                {/* Read Now Button - shown on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg inline-flex items-center gap-2">
                      Read Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Magazine Info */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-red-400 transition-colors duration-300">{magazine.title}</h3>
                <div className="text-sm text-gray-400 mb-3">{formatDate(magazine.created_at)}</div>
                <p className="text-gray-300 line-clamp-3 mb-4">{magazine.description}</p>
                
                {/* Status Badge - only shown for drafts */}
                {magazine.status === "draft" && (
                  <span className="inline-block mb-2 px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-xs font-medium border border-yellow-700/30">
                    Draft
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* No magazines found state */}
        {magazines.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-200">No Magazines Available</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              There are currently no published magazines available. Please check back later for new releases.
            </p>
          </div>
        )}
        
        {/* Coming Soon Teaser - Only show if there are magazines */}
        {magazines.length > 0 && (
          <div className="mt-24 relative">
            <div className="absolute -inset-x-4 -top-12 -bottom-12 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 blur-sm rounded-xl -z-10"></div>
            <div className="relative backdrop-blur-sm bg-black/40 rounded-xl p-12 border border-red-900/20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="md:w-2/3">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-400">Coming Soon: Next Month's Issue</h3>
                  <p className="text-gray-300 mb-6">
                    Our team is working on something special for the next edition. Exclusive interviews, 
                    in-depth features, and stunning photography showcasing the best of Las Vegas.
                  </p>
                  <button className="bg-red-600/80 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 hover:shadow-lg hover:shadow-red-600/30 inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                    </svg>
                    Subscribe for Updates
                  </button>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center shadow-xl shadow-red-900/30 relative">
                    <span className="absolute -inset-1 rounded-full animate-pulse bg-red-500/20"></span>
                    <div className="text-center">
                      <div className="text-3xl font-bold">New</div>
                      <div className="text-xs font-medium">Coming Soon</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default MagazineGrid;
