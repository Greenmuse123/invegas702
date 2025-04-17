import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  image_url: string | null;
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !event) {
    notFound();
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative w-full h-96 mb-8">
        <img
          src={event.image_url || '/placeholder.svg'}
          alt={event.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      <div className="space-y-2 mb-6">
        <p className="text-gray-600">
          <span className="font-semibold">Start:</span> {formatDateTime(event.start_date)}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">End:</span> {formatDateTime(event.end_date)}
        </p>
      </div>
      <div className="prose max-w-none">
        <p>{event.description}</p>
      </div>
    </div>
  );
} 