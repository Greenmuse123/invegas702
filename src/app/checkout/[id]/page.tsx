import { cookies as nextCookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import React from 'react';
import Link from 'next/link';



// Cookie adapter for @supabase/ssr
const cookieAdapter = {
  get: (key: string) => {
    const cookie = nextCookies().get(key);
    return cookie?.value ?? null;
  },
  set: () => {},
  remove: () => {},
};

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  // Fetch magazine info
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieAdapter }
  );
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-white">
        <div className="bg-black/80 border border-red-900/40 rounded-2xl shadow-2xl p-12 max-w-lg w-full text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-red-500 mb-6">Magazine Not Found</h1>
          <p className="mb-8 text-gray-300 text-lg">Sorry, we couldn't find the magazine you're looking for.</p>
          <Link href="/shop" className="inline-block rounded-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-md border border-red-900/40 hover:border-red-400 transition-colors">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  // Stripe payment integration
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-white">
      <div className="bg-black/80 border border-red-900/40 rounded-2xl shadow-2xl p-12 max-w-lg w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-red-500 mb-6">Checkout: {data.title}</h1>
        <div className="mb-6">
          <img
            src={data.teaser_image_url || '/images/placeholder.jpg'}
            alt={data.title}
            className="mx-auto rounded-lg shadow-lg mb-4 max-h-48 object-cover"
            style={{ maxWidth: '80%' }}
          />
          <div className="text-gray-300 mb-2">Issue #{data.issue_number}</div>
          <div className="text-gray-400 text-sm mb-2">{data.description}</div>
          <div className="text-2xl font-extrabold text-red-400 mb-4">$9.99</div>
        </div>
        <form
          action={"/api/checkout"}
          method="POST"
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                magazine: {
                  id: data.id,
                  title: data.title,
                  price: 9.99,
                  image: data.teaser_image_url,
                  issue_number: data.issue_number,
                },
                quantity: 1,
              }),
            });
            const json = await res.json();
            if (json.url) {
              window.location.href = json.url;
            } else {
              alert(json.error || 'Failed to start checkout.');
            }
          }}
        >
          <button
            type="submit"
            className="inline-block rounded-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-md border border-red-900/40 hover:border-red-400 transition-colors text-lg mb-4 w-full"
          >
            Buy Print Copy &amp; Checkout
          </button>
        </form>
        <Link href="/shop" className="inline-block rounded-full px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-100 border border-white/10 hover:border-red-400 font-semibold transition-colors">
          Back to Shop
        </Link>
      </div>
    </main>
  );
}
