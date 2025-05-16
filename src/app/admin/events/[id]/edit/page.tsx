'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminProtected from '@/components/AdminProtected';
import { useAuth } from '@/components/Providers';
import { BUCKETS } from '@/lib/constants';



export default function EditEvent() {
  const router = useRouter();
  const { id } = useParams();
  const { supabase } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    start_date: '',
    start_time: '12:00',
    end_date: '',
    end_time: '12:00',
    status: 'published'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Event ID is missing');
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Event not found');

        // Parse dates and times from ISO string
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);

        setFormData({
          title: data.title,
          description: data.description,
          location: data.location,
          start_date: startDate.toISOString().split('T')[0],
          start_time: startDate.toISOString().split('T')[1].substring(0, 5),
          end_date: endDate.toISOString().split('T')[0],
          end_time: endDate.toISOString().split('T')[1].substring(0, 5),
          status: data.status || 'published'
        });

        setCurrentImageUrl(data.image_url);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Error loading event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = currentImageUrl;

      if (imageFile) {
        // Use the API route for file uploads
        const formDataObj = new FormData();
        formDataObj.append('file', imageFile);
        formDataObj.append('bucket', BUCKETS.EVENTS);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataObj
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const data = await response.json();
        imageUrl = data.url;
      }

      // Combine date and time for start and end
      const startDateTime = `${formData.start_date}T${formData.start_time}:00`;
      const endDateTime = formData.end_date 
        ? `${formData.end_date}T${formData.end_time}:00` 
        : startDateTime;

      // Use the authenticated supabase client for DB actions
      const { error } = await supabase
        .from('events')
        .update({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          start_date: startDateTime,
          end_date: endDateTime,
          image_url: imageUrl,
          status: formData.status
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/events');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminProtected>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-xl">Loading event...</div>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected>
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Edit Event</h1>
            <button
              onClick={() => router.push('/admin/events')}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
            >
              Back to Events
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-600 text-red-200 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white resize-none"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-1">
                Event Image
              </label>
              {currentImageUrl && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400 mb-2">Current image:</p>
                  <img 
                    src={currentImageUrl} 
                    alt="Current event image" 
                    className="h-32 object-cover rounded border border-gray-700" 
                  />
                </div>
              )}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
              />
              <p className="text-sm text-gray-400 mt-1">Leave empty to keep current image</p>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-red-600 text-white rounded font-medium ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'
                } transition`}
              >
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminProtected>
  );
}
