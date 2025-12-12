'use client';

import { useEffect, useState } from 'react';
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

// Reusable form components
interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  rows?: number;
  as?: 'input' | 'textarea';
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  min,
  max,
  step,
  rows = 3,
  as = 'input'
}) => {
  const inputClasses = "bg-white w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {as === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
        />
      )}
    </div>
  );
};

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
  const [uploadingImage, setUploadingImage] = useState(false);
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

  // Fetch book data for edit mode
  useEffect(() => {
    if (mode === 'edit' && bookId) {
      fetchBookData();
    }
  }, [mode, bookId]);

  const fetchBookData = async () => {
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
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return form.coverImage;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch(ADMIN_ENDPOINTS.uploadImage, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        alert('Failed to upload image');
        return null;
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image if selected
      const imageUrl = await uploadImage();
      if (selectedImage && !imageUrl) {
        setLoading(false);
        return;
      }

      const submitData = {
        ...form,
        coverImage: imageUrl || form.coverImage,
        publishedYear: form.publishedYear ? parseInt(form.publishedYear) : '',
        pages: form.pages ? parseInt(form.pages) : '',
        price: form.price ? parseFloat(form.price) : '',
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'edit' ? 'Edit Book' : 'Add New Book'}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === 'edit' ? 'Update the book details below.' : 'Fill in the details to create a new book.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Enter book title"
          required
        />

        <FormField
          label="Slug"
          name="slug"
          value={form.slug}
          onChange={handleInputChange}
          placeholder="book-slug-url"
          required
        />

        <FormField
          label="Short Description"
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleInputChange}
          as="textarea"
          rows={3}
          placeholder="Brief description for listings"
        />

        <FormField
          label="Full Description"
          name="description"
          value={form.description}
          onChange={handleInputChange}
          as="textarea"
          rows={6}
          placeholder="Detailed book description (HTML allowed)"
        />

        <FormField
          label="Age Group"
          name="ageGroup"
          value={form.ageGroup}
          onChange={handleInputChange}
          placeholder="e.g., 6–9 years"
        />

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FormField
              label=""
              name="coverImage"
              value={form.coverImage}
              onChange={handleInputChange}
              placeholder="Or enter image URL"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Cover preview" className="w-32 h-48 object-cover rounded-lg shadow-md" />
              </div>
            )}
          </div>
        </div>

        <FormField
          label="Buy Link"
          name="buyLink"
          value={form.buyLink}
          onChange={handleInputChange}
          type="url"
          placeholder="https://..."
        />

        <FormField
          label="ISBN"
          name="isbn"
          value={form.isbn}
          onChange={handleInputChange}
          placeholder="9788123456789"
        />

        <FormField
          label="Author"
          name="author"
          value={form.author}
          onChange={handleInputChange}
          placeholder="Author name"
        />

        <FormField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleInputChange}
          placeholder="Fiction, Adventure, etc."
        />

        <FormField
          label="Price (₹)"
          name="price"
          value={form.price}
          onChange={handleInputChange}
          type="number"
          min="0"
          step="0.01"
          placeholder="299.00"
        />

        {/* Published Year and Pages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Published Year"
            name="publishedYear"
            value={form.publishedYear}
            onChange={handleInputChange}
            type="number"
            min="1900"
            max="2030"
            placeholder="2024"
          />
          <FormField
            label="Pages"
            name="pages"
            value={form.pages}
            onChange={handleInputChange}
            type="number"
            min="1"
            placeholder="32"
          />
        </div>

        {/* Featured */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Featured Book</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : uploadingImage ? 'Uploading...' : (mode === 'edit' ? 'Update Book' : 'Create Book')}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}