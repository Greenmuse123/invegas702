import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
  author: string;
  status: 'draft' | 'published';
  category?: string;
}

export default async function ArticlesPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published') // Only show published articles
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return <div>Error loading articles</div>;
  }

  // Format published date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
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
      {/* SVG Overlay - Abstract Energy Flow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image src="/images/las-vegas-overlay.svg" alt="Vegas energy pattern" fill className="object-cover" />
      </div>
      
      {/* Hero Section with Background Image */}
      <section className="relative pt-24 pb-20 mb-12 overflow-hidden z-10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10"></div>
          <Image 
            src="/images/las-vegas-680953_1920.jpg" 
            alt="Las Vegas nightlife"
            fill
            priority
            className="object-cover object-center brightness-75"
          />
          <div className="absolute inset-0 bg-red-900/20 mix-blend-overlay z-10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white [text-shadow:_0_2px_10px_rgba(0,0,0,0.5)]">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Articles</span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 leading-relaxed [text-shadow:_0_1px_3px_rgba(0,0,0,0.7)]">
              Explore the latest stories, interviews, and features about Las Vegas culture, entertainment, and lifestyle.
              Get the inside scoop on what makes our city unique.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto rounded-full shadow-lg shadow-red-900/30"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 container mx-auto px-4 pb-24">
        {/* Filter Options - Can be expanded later */}
        <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-gray-200">Latest Stories</h2>
          <div className="flex items-center bg-gray-900/70 p-2 rounded-lg border border-gray-800">
            <span className="text-sm text-gray-400 mr-2">Filter by:</span>
            <select className="bg-transparent text-gray-200 text-sm border-none focus:ring-0 cursor-pointer">
              <option value="all">All Categories</option>
              <option value="entertainment">Entertainment</option>
              <option value="dining">Dining</option>
              <option value="culture">Culture</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>
        </div>
        
        {/* Articles Grid */}
        {articles?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-200">No Articles Available</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              There are currently no published articles available. Please check back later for new content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {articles?.map((article: Article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group flex flex-col bg-gradient-to-br from-gray-900 to-black/70 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-red-900/10 transition-all duration-300 hover:-translate-y-1 border border-gray-800 hover:border-red-900/30"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>
                  <Image
                    src={article.image_url || '/placeholder.svg'}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {article.category && (
                    <div className="absolute top-4 left-4 z-20 bg-red-600/90 px-3 py-1 rounded-full text-xs font-medium text-white">
                      {article.category}
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold mb-2 text-gray-100 group-hover:text-red-400 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-3">By {article.author} • {formatDate(article.created_at)}</p>
                  <p className="text-gray-300 mb-4 line-clamp-3">{article.content}</p>
                  <div className="mt-auto pt-4 flex items-center text-red-500 text-sm font-medium group-hover:text-red-400">
                    Read Full Article
                    <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-24 relative">
          <div className="absolute -inset-x-4 -top-12 -bottom-12 bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 blur-sm rounded-xl -z-10"></div>
          <div className="relative backdrop-blur-sm bg-black/40 rounded-xl p-12 border border-red-900/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-red-400">Subscribe to Our Newsletter</h3>
                <p className="text-gray-300 mb-6">
                  Get the latest articles, event announcements, and exclusive content delivered straight to your inbox.
                  Join our community of Las Vegas enthusiasts.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-200"
                  />
                  <button className="bg-red-600/90 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 hover:shadow-lg hover:shadow-red-600/30 whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="hidden md:block md:w-1/3">
                <div className="bg-gradient-to-br from-red-900/30 to-black p-6 rounded-xl border border-red-900/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-300 text-sm">Join <span className="text-red-400 font-bold">2,500+</span> subscribers</p>
                    <p className="text-gray-400 text-xs mt-1">New content every week</p>
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