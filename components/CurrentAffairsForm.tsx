'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS } from '../lib/admin-config';
import { CurrentAffairs } from '../lib/types';

interface CurrentAffairsFormProps {
  mode: 'add' | 'edit';
  currentAffairsId?: string;
}

export default function CurrentAffairsForm({ mode, currentAffairsId }: CurrentAffairsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    publishedAt: '',
    coverImage: '',
    is_featured: false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Load existing data for edit mode
  useEffect(() => {
    if (mode === 'edit' && currentAffairsId) {
      const loadCurrentAffairs = async () => {
        try {
          const response = await fetch(`${ADMIN_ENDPOINTS.editCurrentAffairs}?id=${currentAffairsId}`, {
            credentials: 'include'
          });
          const data = await response.json();
          if (data) {
            setForm({
              title: data.title || '',
              slug: data.slug || '',
              excerpt: data.excerpt || '',
              content: data.content || '',
              status: data.status || 'draft',
              publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : '',
              coverImage: data.coverImage || '',
              is_featured: Boolean(data.is_featured),
            });
            if (data.coverImage) {
              setImagePreview(data.coverImage);
            }
          }
        } catch (error) {
          console.error('Error loading current affairs:', error);
          alert('Failed to load current affairs data');
        }
      };
      loadCurrentAffairs();
    }
  }, [mode, currentAffairsId]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name === 'title') {
      setForm(prev => ({
        ...prev,
        title: value,
        slug: generateSlug(value)
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setForm(prev => ({ ...prev, coverImage: '' }));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return form.coverImage;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('folder', 'current-affairs');

      console.log('Uploading image:', selectedImage.name, 'Size:', selectedImage.size);

      const response = await fetch(ADMIN_ENDPOINTS.uploadImage, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      console.log('Upload response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload response data:', data);
        if (data.success && data.imageUrl) {
          return data.imageUrl;
        } else {
          console.error('Upload failed:', data.message || 'No imageUrl in response');
          alert('Failed to upload image: ' + (data.message || 'Unknown error'));
          return null;
        }
      } else {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status, 'Response:', errorText);
        alert('Failed to upload image: HTTP ' + response.status);
        return null;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if selected
      let imageUrl = form.coverImage; // Start with existing image URL
      if (selectedImage) {
        // Only upload if there's a newly selected image
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setLoading(false);
          return; // Upload failed, don't submit form
        }
        imageUrl = uploadedUrl;
        // Clear the selected image and update form state
        setSelectedImage(null);
        setForm(prev => ({ ...prev, coverImage: imageUrl }));
      }

      const submitData: Record<string, string> = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        status: form.status,
        publishedAt: form.publishedAt,
        coverImage: imageUrl,
        is_featured: form.is_featured.toString(),
      };

      const url = mode === 'edit' && currentAffairsId
        ? `${ADMIN_ENDPOINTS.editCurrentAffairs}?id=${currentAffairsId}`
        : ADMIN_ENDPOINTS.editCurrentAffairs;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(submitData as any).toString(),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        router.push('/admin/dashboard');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('An error occurred while saving the current affairs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {mode === 'edit' ? 'Edit Current Affairs' : 'Add Current Affairs'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter current affairs title"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={form.slug}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="url-friendly-slug"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of the current affairs"
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleInputChange}
              required
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full content of the current affairs"
            />
          </div>

          {/* Status and Publish Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700 mb-2">
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                id="publishedAt"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Featured Checkbox */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full max-w-md h-48 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (mode === 'edit' ? 'Update Current Affairs' : 'Create Current Affairs')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}