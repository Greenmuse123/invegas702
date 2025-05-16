"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartContext';

interface ShopMagazineCardProps {
  id: string | number;
  title: string;
  coverImage: string;
  issueDate: string;
  description: string;
  price?: number; // default price
}

/**
 * A card component for the Shop page, showing the magazine cover, metadata, price,
 * and buttons to read online (free) or purchase a print/digital copy.
 */
export function ShopMagazineCard({
  id,
  title,
  coverImage,
  issueDate,
  description,
  price = 14.99,
}: ShopMagazineCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-xl bg-gradient-to-b from-black/90 to-gray-900 border border-red-900/30 hover:border-red-500/60 transition-all duration-300 flex flex-col min-h-[500px]">
      {/* Cover image with overlay */}
      <div className="relative h-64">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <div className="absolute top-3 left-3 bg-red-700/80 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg z-20">
          {issueDate}
        </div>
      </div>
      {/* Card content */}
      <div className="flex flex-col flex-1 p-6 pt-4 z-20">
        <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 [text-shadow:_0_2px_8px_rgba(0,0,0,0.3)]">
          {title}
        </h3>
        <p className="text-gray-300 text-base mb-4 line-clamp-3 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-extrabold text-red-400 drop-shadow-sm">${price.toFixed(2)}</span>
          <div className="flex gap-2">
            <Link
              href={`/magazines/${id}`}
              className="rounded-full px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/20 text-gray-100 border border-white/10 hover:border-red-400 transition-colors shadow-sm"
            >
              Read Free
            </Link>
            {/* Add to Cart button */}
            <button
              type="button"
              className="rounded-full px-4 py-2 text-sm font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg border border-red-900/40 hover:border-red-400 transition-colors"
              onClick={() => {
                addToCart({ id, title, price, image: coverImage, issue_number: undefined, quantity: 1 });
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {/* Decorative border glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-500/80 transition-all duration-300 group-hover:shadow-[0_0_32px_4px_rgba(239,68,68,0.3)]"></div>
    </div>
  );
}
