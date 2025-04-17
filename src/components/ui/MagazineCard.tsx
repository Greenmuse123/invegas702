import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MagazineCardProps {
  id: string;
  title: string;
  coverImage: string;
  issueDate: string;
  description: string;
}

export function MagazineCard({ id, title, coverImage, issueDate, description }: MagazineCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-64">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-2">{issueDate}</p>
        <p className="text-gray-700 mb-4 line-clamp-2">{description}</p>
        <Link 
          href={`/magazines/${id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
} 