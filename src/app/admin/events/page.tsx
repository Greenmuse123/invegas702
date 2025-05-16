'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminProtected from '../../../components/AdminProtected';
import { useAuth } from '../../../components/Providers';

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string | null;
}

export default function AdminEvents() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');
  const { supabase } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this event?')) {
        return;
      }
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchEvents();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <Link
            href="/admin/events/new"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
          >
            Add New Event
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-black border border-red-900 rounded-lg overflow-hidden"
            >
              {event.image_url && (
                <div className="relative h-48">
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold text-red-600 mb-2">
                  {event.title}
                </h2>
                <p className="text-gray-300 mb-2">
                  {new Date(event.start_date).toLocaleDateString()}
                  {event.end_date && event.end_date !== event.start_date && 
                    ` - ${new Date(event.end_date).toLocaleDateString()}`}
                </p>
                <p className="text-gray-300 mb-2">{event.location}</p>
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {event.description}
                </p>
                <div className="flex justify-end space-x-4">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-red-600 hover:text-red-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminProtected>
  );
} 