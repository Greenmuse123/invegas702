'use client';

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  date: string
  location: string
  image: string
  category: string
}

const upcomingEvents: Event[] = [
  {
    id: '1',
    title: 'Las Vegas Food & Wine Festival',
    date: 'April 15-17, 2024',
    location: 'Bellagio Hotel',
    image: '/images/events/food-festival.jpg',
    category: 'Food & Drink',
  },
  {
    id: '2',
    title: 'Summer Pool Party Series',
    date: 'May 1 - September 30, 2024',
    location: 'Various Venues',
    image: '/images/events/pool-party.jpg',
    category: 'Nightlife',
  },
  {
    id: '3',
    title: 'Art in the Desert',
    date: 'June 10-12, 2024',
    location: 'Downtown Arts District',
    image: '/images/events/art-festival.jpg',
    category: 'Arts & Culture',
  },
]

export function Events() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover the hottest events and experiences in Las Vegas. From world-class
            entertainment to exclusive nightlife, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <article
              key={event.id}
              className="bg-secondary-light rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105"
            >
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-primary text-sm font-medium">
                    {event.category}
                  </span>
                  <span className="text-gray-400 text-sm">{event.date}</span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-2">
                  <Link href={`/events/${event.id}`} className="hover:text-primary">
                    {event.title}
                  </Link>
                </h3>
                <p className="text-gray-300 mb-4">{event.location}</p>
                <Link
                  href={`/events/${event.id}`}
                  className="text-primary hover:text-primary-dark font-medium inline-flex items-center"
                >
                  Learn More
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/events"
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
          >
            View All Events
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
} 