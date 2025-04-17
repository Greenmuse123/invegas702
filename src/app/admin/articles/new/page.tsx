'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  title: string;
  content: string;
  image: File | null;
  category: string;
  author: string;
  is_featured: boolean;
}

export default function NewArticle() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    image: null,
    category: '',
    author: '',
    is_featured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('is_featured', formData.is_featured.toString());
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      router.push('/admin/articles');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Failed to create article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-red-600">Create New Article</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Select a category</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="food">Food</option>
              <option value="events">Events</option>
              <option value="business">Business</option>
              <option value="people">People</option>
            </select>
          </div>

          {/* Author */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Featured Article */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-red-900 rounded"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-300">
              Feature this article on the home page
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Featured Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-gray-300"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={10}
              className="w-full px-4 py-2 bg-black border border-red-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
} 