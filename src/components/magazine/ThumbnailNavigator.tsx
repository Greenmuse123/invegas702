'use client';

import React from 'react';
import Image from 'next/image';

interface ThumbnailNavigatorProps {
  pageUrls: string[];
  currentPage: number;
  onPageClick: (pageNumber: number) => void;
}

export default function ThumbnailNavigator({ 
  pageUrls, 
  currentPage, 
  onPageClick 
}: ThumbnailNavigatorProps) {
  return (
    <div className="thumbnail-navigator w-full overflow-x-auto py-4 bg-gray-900/50 rounded-lg">
      <div className="flex space-x-4 min-w-max px-4 pb-2">
        {pageUrls.map((url, index) => (
          <div 
            key={index}
            className={`thumbnail-item cursor-pointer transition-all duration-200 ${
              currentPage === index 
                ? 'border-2 border-red-600 scale-110 shadow-lg shadow-red-600/30' 
                : 'border border-gray-700 hover:border-gray-400 hover:scale-105'
            }`}
            onClick={() => onPageClick(index)}
            title={`Go to page ${index + 1}`}
          >
            <div className="relative w-24 h-32 overflow-hidden">
              <Image
                src={url}
                alt={`Thumbnail page ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs text-center py-1">
                {index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
