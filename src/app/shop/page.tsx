import { cookies as nextCookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ShopMagazineCard } from '@/components/ui/ShopMagazineCard';

interface Magazine {
  id: number;
  title: string;
  description: string;
  pdf_url: string;
  teaser_image_url?: string;
  status: 'draft' | 'published';
  issue_number: number;
  created_at: string;
  updated_at: string;
}

// Cookie adapter for @supabase/ssr
const cookieAdapter = {
  get: (key: string) => {
    const cookie = nextCookies().get(key);
    return cookie?.value ?? null;
  },
  set: () => {},
  remove: () => {},
};

export default async function ShopPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Error loading shop: {error.message}
      </div>
    );
  }

  const cleanedMagazines = await Promise.all(
    (data || []).map(async (mag) => {
      let teaser_url = mag.teaser_image_url;
      let signedTeaserUrl = teaser_url;
      if (teaser_url) {
        const { data: teaserSignedData } = await supabase.storage
          .from('magazines-storage')
          .createSignedUrl(teaser_url.replace(/^\/+/g, ''), 60 * 60);
        if (teaserSignedData?.signedUrl) signedTeaserUrl = teaserSignedData.signedUrl;
      }
      return { ...mag, teaser_image_url: signedTeaserUrl } as Magazine;
    })
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative">
      <section className="container mx-auto px-4 py-20 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-red-500">Magazine Shop</h1>
        {cleanedMagazines.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No magazines available for purchase at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cleanedMagazines.map((mag) => (
              <ShopMagazineCard
                key={mag.id}
                id={mag.id}
                title={mag.title}
                coverImage={mag.teaser_image_url || '/images/placeholder.jpg'}
                issueDate={`Issue #${mag.issue_number}`}
                description={mag.description}
              />
            ))}
          </div>
        )}
      </section>
      {/* subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-5" />
    </main>
  );
}
