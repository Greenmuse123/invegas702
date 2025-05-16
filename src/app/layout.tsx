import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ClientWrapper } from '../components/ClientWrapper';
import Footer from '../components/Footer';

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
        <ClientWrapper>
          {children}
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  );
} 