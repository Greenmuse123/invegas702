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
}

export default async function ArticlesPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return <div>Error loading articles</div>;
  }

  return (
    <main className="min-h-screen bg-black py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-red-600">Articles</h1>
        {articles?.length === 0 ? (
          <div className="text-center text-gray-300">
            <p className="text-xl">No articles available at the moment.</p>
            <p className="mt-4">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles?.map((article: Article) => (
              <div key={article.id} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={article.image_url || '/placeholder.svg'}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-white">{article.title}</h2>
                  <p className="text-gray-400 mb-4">By {article.author}</p>
                  <p className="text-gray-300 mb-4 line-clamp-3">{article.content}</p>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 