import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  location: string;
  description: string;
}

export function EventCard({ id, title, coverImage, date, location, description }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
      <div className="relative h-48 md:h-auto md:w-1/3">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6 md:w-2/3">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <div className="flex items-center gap-4 text-gray-600 mb-4">
          <div>
            <span className="font-medium">Date:</span> {date}
          </div>
          <div>
            <span className="font-medium">Location:</span> {location}
          </div>
        </div>
        <p className="text-gray-700 mb-4">{description}</p>
        <Link 
          href={`/events/${id}`}
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
} 