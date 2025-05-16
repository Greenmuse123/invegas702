'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EventSubmissionForm from "./EventSubmissionForm";

// Modal helper
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="relative z-10 bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg flex flex-col items-center animate-fade-in" style={{ minHeight: '650px', height: 'auto', maxHeight: '90vh', overflowY: 'auto' }}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  start_date: string;
  end_date?: string;
  location: string;
  status: 'draft' | 'published';
  url?: string;
  created_at: string;
}

interface EventsContentProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export function EventsContent({ upcomingEvents, pastEvents }: EventsContentProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showEventModal, setShowEventModal] = useState(false);

  // Function to render event cards (reused for both tabs)
  const renderEventCards = (events: Event[]) => {
    if (events.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-200">
            {activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {activeTab === 'upcoming'
              ? "We don't have any upcoming events scheduled at the moment. Check back soon for new events or subscribe to our newsletter for updates."
              : "There are no past events to display. Once events take place, they'll appear here as an archive."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {events.map((event: Event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="group flex flex-col bg-gradient-to-br from-gray-900/80 to-black/60 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-red-900/10 transition-all duration-300 hover:-translate-y-1 border border-gray-800 hover:border-red-900/30 h-full"
          >
            {/* Event Image */}
            <div className="relative aspect-video overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
              {event.image_url ? (
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-gradient-to-b from-red-900/20 to-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              
              {/* Event Date Badge */}
              <div className="absolute top-4 left-4 z-20">
                <div className={`bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden border ${activeTab === 'past' ? 'border-gray-500/30' : 'border-red-500/30'}`}>
                  <div className={`${activeTab === 'past' ? 'bg-gray-600' : 'bg-red-600'} text-white text-xs font-bold py-1 px-3 text-center uppercase`}>
                    {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-white text-center font-bold text-xl py-1 px-3">
                    {new Date(event.start_date).getDate()}
                  </div>
                </div>
              </div>

              {/* Past Event Overlay */}
              {activeTab === 'past' && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-gray-500/30 py-1 px-3">
                    <span className="text-gray-300 text-xs font-medium">PAST EVENT</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Event Info */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-red-400 transition-colors line-clamp-2">
                {event.title}
              </h3>
              
              <div className="flex items-center mb-3 text-gray-400 text-sm">
                <svg className="w-4 h-4 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{event.location}</span>
              </div>
              
              <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>
              
              <div className="mt-auto pt-4 flex items-center text-red-500 text-sm font-medium group-hover:text-red-400">
                {activeTab === 'upcoming' ? 'View Event Details' : 'View Event Archive'}
                <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
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
            alt="Las Vegas events and entertainment"
            fill
            priority
            className="object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
              {activeTab === 'upcoming' ? (
                <>Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Events</span></>
              ) : (
                <>Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Events</span></>
              )}
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed [text-shadow:_0_1px_3px_rgba(0,0,0,0.7)]">
              {activeTab === 'upcoming' ? (
                <>Discover exciting happenings around Las Vegas. From exclusive parties and shows to community gatherings,
                find the perfect event to enhance your Vegas experience.</>
              ) : (
                <>Browse through our past events and relive the memories. Our archive captures the vibrant spirit
                of Las Vegas and our community gatherings.</>
              )}
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full shadow-lg shadow-red-900/30"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 container mx-auto px-4 pb-24">
        {/* Filter/Tab Options */}
        <div className="flex flex-wrap gap-4 mb-16 border-b border-gray-800">
          <button 
            className={`font-bold text-lg pb-4 border-b-2 mr-8 transition-colors ${
              activeTab === 'upcoming' 
                ? 'text-red-500 border-red-500' 
                : 'text-gray-400 hover:text-gray-200 border-transparent hover:border-gray-700'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button 
            className={`font-bold text-lg pb-4 border-b-2 transition-colors ${
              activeTab === 'past' 
                ? 'text-red-500 border-red-500' 
                : 'text-gray-400 hover:text-gray-200 border-transparent hover:border-gray-700'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
        </div>
        
        {/* Events Content - conditionally render based on active tab */}
        {activeTab === 'upcoming' ? renderEventCards(upcomingEvents) : renderEventCards(pastEvents)}

        {/* Join Our Community Section */}
        <div className="mt-24 relative">
          <div className="absolute -inset-x-4 -top-12 -bottom-12 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 blur-sm rounded-xl -z-10"></div>
          <div className="relative backdrop-blur-sm bg-black/40 rounded-xl p-12 border border-red-900/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-400">Host Your Event With Us</h3>
                <p className="text-gray-300 mb-6">
                  Are you organizing an event in Las Vegas? Partner with InVegas702 to reach our community
                  of locals and visitors. We can help promote your event and connect you with our audience.
                </p>
                {/* Submit Event Button triggers modal */}
                <button
                  className="bg-red-600/90 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 hover:shadow-lg hover:shadow-red-600/30 whitespace-nowrap mb-6 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  style={{ minWidth: 200, minHeight: 56, fontSize: '1.25rem', display: 'inline-block' }}
                  onClick={() => setShowEventModal(true)}
                >
                  Submit Your Event
                </button>
                {/* Modal for Event Submission Form */}
                <Modal open={showEventModal} onClose={() => setShowEventModal(false)}>
                  <h2 className="text-2xl font-bold mb-4 text-red-400">Submit Your Event</h2>
                  <EventSubmissionForm />
                </Modal>
              </div>
              <div className="hidden md:block md:w-1/3">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-red-700 animate-pulse opacity-30"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="text-sm font-medium">Promote Your Event</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
