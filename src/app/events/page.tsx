import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { EventsContent } from '@/components/events/EventsContent';



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

  // Calculate if event is upcoming or past
  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate >= today;
  };

  // Group events by upcoming or past
  const upcomingEvents = events?.filter(event => isUpcoming(event.start_date)) || [];
  const pastEvents = events?.filter(event => !isUpcoming(event.start_date)) || [];

  // Sort past events in reverse chronological order (newest first)
  pastEvents.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

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
      {/* SVG Overlay - Abstract Energy Flow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image src="/images/las-vegas-overlay.svg" alt="Vegas energy pattern" fill className="object-cover" />
      </div>
      <div className="relative z-10">
        <EventsContent upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
      </div>
    </main>
  );
}