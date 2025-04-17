import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

export default async function EventsPage() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch all published events
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return <div>Error loading events</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-red-600">Upcoming Events</h1>
        
        {events?.length === 0 ? (
          <div className="text-center text-gray-300">
            <p className="text-xl">No upcoming events at the moment.</p>
            <p className="mt-4">Check back soon for new events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.map((event) => (
              <div key={event.id} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-white">{event.title}</h2>
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">
                      {formatDate(event.start_date)}
                    </span>
                    <Link
                      href={`/events/${event.id}`}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 