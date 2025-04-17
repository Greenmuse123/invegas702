import './globals.css';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/layout/Navigation';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'InVegas702 Magazine',
  description: 'Your premier source for Las Vegas lifestyle and culture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <Providers>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-black border-t border-red-900 py-8">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600">About Us</h3>
                  <p className="text-gray-300">
                    Your premier source for Las Vegas lifestyle, culture, and events.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><a href="/magazines" className="text-gray-300 hover:text-red-600">Magazines</a></li>
                    <li><a href="/articles" className="text-gray-300 hover:text-red-600">Articles</a></li>
                    <li><a href="/events" className="text-gray-300 hover:text-red-600">Events</a></li>
                    <li><a href="/about" className="text-gray-300 hover:text-red-600">About</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600">Contact</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>Email: contact@invegas702.com</li>
                    <li>Phone: (702) XXX-XXXX</li>
                    <li>Las Vegas, NV</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-red-900 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} InVegas702 Magazine. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
} 