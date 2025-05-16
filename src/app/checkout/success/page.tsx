import React from 'react';
import Link from 'next/link';

export default function CheckoutSuccess() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-white">
      <div className="bg-black/80 border border-green-700/40 rounded-2xl shadow-2xl p-12 max-w-lg w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-6">Thank You for Your Purchase!</h1>
        <p className="mb-8 text-gray-300 text-lg">
          Your order has been received and is being processed.<br />
          Your magazine will be shipped to your provided address soon.
        </p>
        <Link href="/shop" className="inline-block rounded-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold shadow-md border border-red-900/40 hover:border-red-400 transition-colors">
          Back to Shop
        </Link>
      </div>
    </main>
  );
}
