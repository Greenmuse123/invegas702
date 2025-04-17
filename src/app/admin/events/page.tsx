'use client';

import React, { useState, useEffect } from 'react';
import { supabase, BUCKETS, uploadFile } from '../../../lib/supabase';
import Image from 'next/image';

type EventStatus = 'draft' | 'published';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
  image_url: string | null;
}

interface FormData {
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  status: EventStatus;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    status: 'draft' as EventStatus,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const { data: imageData, error: imageError } = await uploadFile(
          BUCKETS.EVENTS,
          imageFile,
          `images/${Date.now()}-${imageFile.name}`
        );
        if (imageError) throw imageError;
        if (imageData?.path) {
          imageUrl = imageData.path;
        }
      }

      const { error } = await supabase.from('events').insert({
        ...formData,
        image_url: imageUrl,
      });

      if (error) throw error;

      setIsModalOpen(false);
      setFormData({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        status: 'draft',
      });
      setImageFile(null);
      fetchEvents();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', id);

      if (error) throw error;
      fetchEvents();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-600">Manage Events</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          Add New Event
        </button>
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
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold text-red-600 mb-2">{event.title}</h2>
              <p className="text-gray-300 mb-2">{event.location}</p>
              <p className="text-gray-400 mb-2">
                {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
              </p>
              <p className="text-gray-400 mb-4 line-clamp-3">{event.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded ${
                  event.status === 'published' ? 'bg-green-900/50 text-green-200' : 'bg-yellow-900/50 text-yellow-200'
                }`}>
                  {event.status}
                </span>
                {event.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(event.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-black border border-red-900 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Add New Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white h-32"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Featured Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as EventStatus })}
                  className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-700 text-white rounded hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 