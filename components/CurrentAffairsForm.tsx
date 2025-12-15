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
  const [loadingType, setLoadingType] = useState<'draft' | 'published' | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    publishedAt: new Date().toISOString().slice(0, 16),
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

  const handleSubmit = async (status: 'draft' | 'published') => {
    setLoadingType(status);

    try {
      // Upload image if selected
      let imageUrl = form.coverImage; // Start with existing image URL
      if (selectedImage) {
        // Only upload if there's a newly selected image
        const uploadedUrl = await uploadImage();
        if (!uploadedUrl) {
          setLoadingType(null);
          return; // Upload failed, don't submit form
        }
        imageUrl = uploadedUrl;
        // Clear the selected image and update form state
        setSelectedImage(null);
        setForm(prev => ({ ...prev, coverImage: imageUrl }));
      }

      let publishedAt = form.publishedAt;

      // For new current affairs, set publishedAt based on status
      if (mode === 'add') {
        publishedAt = status === 'published'
          ? new Date().toISOString().slice(0, 16) // Current time for published items
          : ''; // Empty for drafts
      }
      // For edit mode, keep the existing publishedAt

      const submitData: Record<string, string> = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        status: status,
        publishedAt: publishedAt,
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
      setLoadingType(null);
    }
  };

  const handleDelete = async () => {
    if (!currentAffairsId || !confirm('Are you sure you want to delete this current affairs item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${ADMIN_ENDPOINTS.editCurrentAffairs}?id=${currentAffairsId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Failed to delete current affairs item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete current affairs item');
    }
  };

  const pageTitle = mode === 'add' ? 'Add Current Affairs' : 'Edit Current Affairs';
  const publishButtonText = loadingType === 'published'
    ? (mode === 'add' ? 'Publishing...' : 'Updating...')
    : (mode === 'add' ? 'Publish' : (form.status === 'published' ? 'Update' : 'Publish'));

  // Determine which buttons to show
  const showSaveDraftButton = mode === 'add' || (mode === 'edit' && form.status === 'draft'); // Show Save Draft for new items and draft edits
  const showPublishButton = true; // Always show publish/update button

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
          <div className="flex space-x-3">
            {showSaveDraftButton && (
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                disabled={loadingType !== null}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {loadingType === 'draft' ? 'Saving...' : 'Save Draft'}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={loadingType !== null}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {publishButtonText}
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
                onChange={handleInputChange}
                placeholder="Add title"
                className="w-full text-2xl font-bold border-none outline-none p-0 placeholder-gray-400"
                required
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <textarea
                name="content"
                value={form.content}
                onChange={handleInputChange}
                placeholder="Write the full content here..."
                rows={12}
                className="w-full border-none outline-none p-0 resize-none"
                required
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image - Hidden */}
            {false && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Cover Image</h3>

              {imagePreview ? (
                // Image preview with controls
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview.startsWith('data:') ? imagePreview : imagePreview}
                      alt="Cover image preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-sm"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {form.coverImage && (
                    <p className="text-xs text-green-600">✓ Image uploaded successfully</p>
                  )}
                </div>
              ) : (
                // Upload area
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-gray-500 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Select Cover Image</p>

                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
                    >
                      Choose Image
                    </label>
                    <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, GIF, WebP (max 5MB)</p>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Publish Date */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Publish Date & Time</h3>
              <input
                type="datetime-local"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-2">
                Leave empty to publish immediately when clicking Publish.
              </p>
            </div>

            {/* Featured Checkbox */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Item</span>
                </label>
              </div>
            </div>

            {/* Slug */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Slug</h3>
              <div className="flex items-center">
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleInputChange}
                  placeholder="current-affairs-slug"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The slug is the URL-friendly version of the title.
              </p>
            </div>

            {/* Delete Current Affairs - Only for edit mode */}
            {mode === 'edit' && (
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete this current affairs item, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loadingType !== null}
                  className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  {loadingType === 'draft' ? 'Deleting...' : 'Delete this item'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}