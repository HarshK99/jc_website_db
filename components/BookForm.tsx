'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS } from '../lib/admin-config';
import TitleInput from './admin/TitleInput';
import ContentInput from './admin/ContentInput';
import ExcerptInput from './admin/ExcerptInput';
import SlugInput from './admin/SlugInput';
import ImageUpload from './admin/ImageUpload';
import TextInput from './admin/TextInput';
import CheckboxField from './admin/CheckboxField';
import DeleteSection from './admin/DeleteSection';

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
  is_featured: number;
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
    is_featured: 0,
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
          is_featured: bookData.is_featured || 0,
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
        is_featured: form.is_featured ? 'true' : 'false',
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
            <TitleInput
              value={form.title}
              onChange={(value) => {
                setForm(prev => ({
                  ...prev,
                  title: value,
                  slug: generateSlug(value)
                }));
              }}
            />

            {/* Short Description */}
            <ExcerptInput
              value={form.shortDescription}
              onChange={(value) => setForm(prev => ({ ...prev, shortDescription: value }))}
              placeholder="Write a brief description for listings..."
              required={false}
              label="Short Description"
            />

            {/* Full Description */}
            <ContentInput
              value={form.description}
              onChange={(value) => setForm(prev => ({ ...prev, description: value }))}
              placeholder="Write the full book description here..."
              label="Full Description"
              rows={12}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <ImageUpload
              imagePreview={imagePreview}
              onImageSelect={handleImageSelect}
              onRemoveImage={handleRemoveImage}
              folder="books"
            />

            {/* Book Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Book Details</h3>

              <div className="space-y-4">
                <TextInput
                  label="Author"
                  value={form.author}
                  onChange={(value) => setForm(prev => ({ ...prev, author: value }))}
                  placeholder="Author name"
                />

                <TextInput
                  label="Category"
                  value={form.category}
                  onChange={(value) => setForm(prev => ({ ...prev, category: value }))}
                  placeholder="Fiction, Adventure, etc."
                />

                <TextInput
                  label="Age Group"
                  value={form.ageGroup}
                  onChange={(value) => setForm(prev => ({ ...prev, ageGroup: value }))}
                  placeholder="e.g., 6–9 years"
                />

                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Published Year"
                    type="number"
                    value={form.publishedYear}
                    onChange={(value) => setForm(prev => ({ ...prev, publishedYear: value }))}
                    placeholder="2024"
                  />
                  <TextInput
                    label="Pages"
                    type="number"
                    value={form.pages}
                    onChange={(value) => setForm(prev => ({ ...prev, pages: value }))}
                    placeholder="32"
                  />
                </div>

                <TextInput
                  label="Price (₹)"
                  type="number"
                  value={form.price}
                  onChange={(value) => setForm(prev => ({ ...prev, price: value }))}
                  placeholder="299.00"
                />

                <TextInput
                  label="ISBN"
                  value={form.isbn}
                  onChange={(value) => setForm(prev => ({ ...prev, isbn: value }))}
                  placeholder="9788123456789"
                />

                {/* Featured checkbox */}
                <CheckboxField
                  checked={form.is_featured === 1}
                  onChange={(checked) => setForm(prev => ({ ...prev, is_featured: checked ? 1 : 0 }))}
                  label="Featured Book"
                  title="Settings"
                />
              </div>
            </div>

            {/* Buy Link */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Purchase Link</h3>
              <TextInput
                label="Purchase Link"
                type="url"
                value={form.buyLink}
                onChange={(value) => setForm(prev => ({ ...prev, buyLink: value }))}
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Link to where readers can purchase this book.
              </p>
            </div>

            {/* Slug */}
            <SlugInput
              value={form.slug}
              onChange={(value) => setForm(prev => ({ ...prev, slug: value }))}
            />

            {/* Delete Book - Only for edit mode */}
            <DeleteSection
              isEditMode={mode === 'edit'}
              onDelete={handleDelete}
              loading={loading}
              itemType="book"
            />
          </div>
        </div>
      </div>
    </div>
  );
}