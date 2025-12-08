'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS } from '../../../../lib/admin-config';

export default function AddPost() {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft', // Default to draft
  });
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'draft' | 'published' | null>(null);
  const router = useRouter();

  // Function to generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setLoading(true);
    setLoadingType(status);

    try {
      // Set publishedAt based on status
      const publishedAt = status === 'published' 
        ? new Date().toISOString().slice(0, 16) // Current time for published posts
        : ''; // Empty for drafts
      
      const formData = { ...form, status, publishedAt };
      const response = await fetch(ADMIN_ENDPOINTS.editPost, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData),
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.message && errorData.message.includes('Session expired')) {
          alert('Your session has expired. Please login again.');
          router.push('/admin/login');
        } else {
          alert('Failed to create post: ' + (errorData.message || 'Unknown error'));
        }
      }
    } catch (err) {
      alert('Error');
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prevForm => {
      const newForm = { ...prevForm, [name]: value };
      
      // Auto-generate slug when title changes (only if slug is empty or matches previous auto-generated slug)
      if (name === 'title') {
        const autoSlug = generateSlug(value);
        // Only auto-update slug if it's empty or if it was previously auto-generated
        if (!prevForm.slug || prevForm.slug === generateSlug(prevForm.title)) {
          newForm.slug = autoSlug;
        }
      }
      
      return newForm;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Post</h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {loadingType === 'draft' ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {loadingType === 'published' ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Add Title"
                className="w-full text-2xl font-bold border-none outline-none p-0 placeholder-gray-400"
                required
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                rows={20}
                className="w-full border-none outline-none p-0 resize-none"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Publish</h3>
              <p className="text-sm text-gray-600">
                Posts will be published immediately when you click "Publish", or saved as drafts when you click "Save Draft".
              </p>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Featured Image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-500 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-2">Add Featured Image</p>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => alert('Image upload functionality would be implemented here')}
                >
                  Set Featured Image
                </button>
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Excerpt</h3>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Write an excerpt (optional)"
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Excerpts are optional hand-crafted summaries of your content.
              </p>
            </div>

            {/* Slug */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Slug</h3>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">/blog/</span>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="post-slug"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The slug is the URL-friendly version of the title.
              </p>
            </div>
          </div>
        </div>

        {/* Hidden form for submit button */}
        <form id="post-form" className="hidden"></form>
      </div>
    </div>
  );
}