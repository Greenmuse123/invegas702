import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { HomeContent } from '@/components/home/HomeContent';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch latest magazine
  const { data: latestMagazine } = await supabase
    .from('magazines')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Fetch upcoming events (future events or currently ongoing events)
  const { data: upcomingEvents, error: eventsError } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .or(`start_date.gte.${new Date().toISOString()},and(start_date.lte.${new Date().toISOString()},end_date.gte.${new Date().toISOString()})`)
    .order('start_date', { ascending: true })
    .limit(3);

  if (eventsError) {
    console.error('Error fetching events:', eventsError);
  } else {
    console.log('Upcoming events:', upcomingEvents);
  }

  // Fetch featured articles
  const { data: featuredArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  return (
    <HomeContent
      latestMagazine={latestMagazine}
      upcomingEvents={upcomingEvents || []}
      featuredArticles={featuredArticles || []}
    />
  );
} 