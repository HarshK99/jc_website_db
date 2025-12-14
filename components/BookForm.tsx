'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS } from '../lib/admin-config';

interface BookFormData {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  ageGroup: string;
  coverImage: string;
  buyLink: string;
  publishedYear: string;
  pages: string;
  isbn: string;
  author: string;
  category: string;
  price: string;
  is_featured: boolean;
}

interface BookFormProps {
  mode: 'add' | 'edit';
  bookId?: string;
}

export default function BookForm({ mode, bookId }: BookFormProps) {
  const [form, setForm] = useState<BookFormData>({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    ageGroup: '',
    coverImage: '',
    buyLink: '',
    publishedYear: '',
    pages: '',
    isbn: '',
    author: '',
    category: '',
    price: '',
    is_featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
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

  const fetchBookData = useCallback(async () => {
    try {
      const response = await fetch(`${ADMIN_ENDPOINTS.editBook}?id=${bookId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const bookData = await response.json();
        setForm({
          title: bookData.title || '',
          slug: bookData.slug || '',
          shortDescription: bookData.shortDescription || '',
          description: bookData.description || '',
          ageGroup: bookData.ageGroup || '',
          coverImage: bookData.coverImage || '',
          buyLink: bookData.buyLink || '',
          publishedYear: bookData.publishedYear?.toString() || '',
          pages: bookData.pages?.toString() || '',
          isbn: bookData.isbn || '',
          author: bookData.author || '',
          category: bookData.category || '',
          price: bookData.price?.toString() || '',
          is_featured: bookData.is_featured || false,
        });
        if (bookData.coverImage) {
          setImagePreview(bookData.coverImage);
        }
      }
    } catch (error) {
      console.error('Failed to fetch book data:', error);
    }
  }, [bookId]);

  // Fetch book data for edit mode
  useEffect(() => {
    if (mode === 'edit' && bookId) {
      fetchBookData();
    }
  }, [mode, bookId, fetchBookData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      setForm(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return form.coverImage;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('folder', 'books');

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
        shortDescription: form.shortDescription,
        description: form.description,
        ageGroup: form.ageGroup,
        coverImage: imageUrl,
        buyLink: form.buyLink,
        publishedYear: form.publishedYear ? parseInt(form.publishedYear).toString() : '',
        pages: form.pages ? parseInt(form.pages).toString() : '',
        isbn: form.isbn,
        author: form.author,
        category: form.category,
        price: form.price ? parseFloat(form.price).toString() : '',
        is_featured: form.is_featured.toString(),
      };

      const url = mode === 'edit' && bookId
        ? `${ADMIN_ENDPOINTS.editBook}?id=${bookId}`
        : ADMIN_ENDPOINTS.editBook;

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
      alert('An error occurred while saving the book');
    } finally {
      setLoading(false);
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

  const handleDelete = async () => {
    if (!bookId || !confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${ADMIN_ENDPOINTS.editBook}?id=${bookId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Failed to delete book');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete book');
    }
  };

  const pageTitle = mode === 'edit' ? 'Edit Book' : 'Add New Book';
  const publishButtonText = mode === 'edit' ? 'Update Book' : 'Create Book';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : publishButtonText}
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
                placeholder="Add book title"
                className="w-full text-2xl font-bold border-none outline-none p-0 placeholder-gray-400"
                required
              />
            </div>

            {/* Short Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <textarea
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleInputChange}
                placeholder="Write a brief description for listings..."
                rows={4}
                className="w-full border-none outline-none p-0 resize-none"
              />
            </div>

            {/* Full Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Write the full book description here..."
                rows={12}
                className="w-full border-none outline-none p-0 resize-none"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
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

            {/* Book Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Book Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    placeholder="Fiction, Adventure, etc."
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                  <input
                    type="text"
                    name="ageGroup"
                    value={form.ageGroup}
                    onChange={handleInputChange}
                    placeholder="e.g., 6–9 years"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Published Year</label>
                    <input
                      type="number"
                      name="publishedYear"
                      value={form.publishedYear}
                      onChange={handleInputChange}
                      min="1900"
                      max="2030"
                      placeholder="2024"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pages</label>
                    <input
                      type="number"
                      name="pages"
                      value={form.pages}
                      onChange={handleInputChange}
                      min="1"
                      placeholder="32"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="299.00"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={form.isbn}
                    onChange={handleInputChange}
                    placeholder="9788123456789"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Featured checkbox */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={form.is_featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Featured Book</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Buy Link */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Purchase Link</h3>
              <input
                type="url"
                name="buyLink"
                value={form.buyLink}
                onChange={handleInputChange}
                placeholder="https://..."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <p className="text-xs text-gray-500 mt-2">
                Link to where readers can purchase this book.
              </p>
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
                  placeholder="book-slug"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                The slug is the URL-friendly version of the title.
              </p>
            </div>

            {/* Delete Book - Only for edit mode */}
            {mode === 'edit' && (
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete this book, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  {loading ? 'Deleting...' : 'Delete this book'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}