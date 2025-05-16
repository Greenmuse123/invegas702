import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { HomeContent } from '@/components/home/HomeContent';
import { createServerClient } from '@supabase/ssr';

// Cookie adapter for @supabase/ssr
const cookieAdapter = {
  get: (key: string) => {
    const cookie = cookies().get(key);
    return cookie?.value ?? null;
  },
  set: () => {},
  remove: () => {},
};

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const ssrSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );

  // Fetch latest magazine
  const { data: latestMagazineData } = await supabase
    .from('magazines')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Process magazine data to get signed URLs
  let latestMagazine = null;
  if (latestMagazineData) {
    let teaser_url = latestMagazineData.teaser_image_url;
    let pdf_url = latestMagazineData.pdf_url;

    // Generate signed URL for teaser image
    if (teaser_url) {
      const { data: teaserSignedData } = await ssrSupabase.storage
        .from('magazines-storage')
        .createSignedUrl(teaser_url.replace(/^\/+/g, ''), 60 * 60);
      
      if (teaserSignedData?.signedUrl) {
        teaser_url = teaserSignedData.signedUrl;
      }
    }

    // Generate signed URL for PDF
    if (pdf_url) {
      const { data: signedUrlData } = await ssrSupabase.storage
        .from('magazines-storage')
        .createSignedUrl(pdf_url.replace(/^\/+/g, ''), 60 * 60);
      
      if (signedUrlData?.signedUrl) {
        pdf_url = signedUrlData.signedUrl;
      }
    }

    latestMagazine = {
      ...latestMagazineData,
      teaser_image_url: teaser_url,
      pdf_url: pdf_url
    };
  }

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