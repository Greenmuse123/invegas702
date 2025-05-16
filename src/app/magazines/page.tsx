import { createServerClient } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import { MagazineGrid } from '@/components/magazine/MagazineGrid';


// Cookie adapter for @supabase/ssr
const cookieAdapter = {
  get: (key: string) => {
    const cookie = nextCookies().get(key);
    return cookie?.value ?? null;
  },
  set: () => {},
  remove: () => {},
};

export default async function MagazinesPage() {
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
    return <div>Error loading magazines: {error.message}</div>;
  }

  // Generate signed URLs for PDFs and teasers
  const cleanedMagazines = await Promise.all(
    (data || []).map(async magazine => {
      let pdf_url = magazine.pdf_url;
      let teaser_url = magazine.teaser_image_url;
      // Generate signed URL for PDF
      let signedPdfUrl = pdf_url;
      if (pdf_url) {
        const { data: signedUrlData } = await supabase.storage
          .from('magazines-storage')
          .createSignedUrl(pdf_url.replace(/^\/+/g, ''), 60 * 60);
        if (signedUrlData?.signedUrl) signedPdfUrl = signedUrlData.signedUrl;
      }
      // Generate signed URL for teaser image
      let signedTeaserUrl = teaser_url;
      if (teaser_url) {
        const { data: teaserSignedData } = await supabase.storage
          .from('magazines-storage')
          .createSignedUrl(teaser_url.replace(/^\/+/g, ''), 60 * 60);
        if (teaserSignedData?.signedUrl) signedTeaserUrl = teaserSignedData.signedUrl;
      }
      return {
        ...magazine,
        pdf_url: signedPdfUrl,
        teaser_image_url: signedTeaserUrl,
      };
    })
  );
  return <MagazineGrid magazines={cleanedMagazines} />;
}