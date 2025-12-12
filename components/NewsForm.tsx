import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS, API_ENDPOINTS } from '../lib/admin-config';

interface NewsFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  publishedAt: string;
  coverImage: string;
  is_recommended: boolean;
  tags: string[];
}

interface NewsFormProps {
  mode: 'add' | 'edit';
  newsId?: string;
}

export default function NewsForm({ mode, newsId }: NewsFormProps) {
  const [form, setForm] = useState<NewsFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    publishedAt: '',
    coverImage: '',
    is_recommended: false,
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'draft' | 'published' | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState('');
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

  // Auto-generate slug when title changes (only for add mode)
  useEffect(() => {
    if (mode === 'add' && form.title) {
      const newSlug = generateSlug(form.title);
      setForm(prev => ({ ...prev, slug: newSlug }));
    }
  }, [form.title, mode]);

  // Fetch post data for edit mode
  useEffect(() => {
    if (mode === 'edit' && newsId) {
      fetchNewsData();
    }
  }, [mode, newsId]);

  const fetchNewsData = async () => {
    try {
      const response = await fetch(`${ADMIN_ENDPOINTS.editNews}?id=${newsId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const newsData = await response.json();
        setForm({
          title: newsData.title || '',
          slug: newsData.slug || '',
          excerpt: newsData.excerpt || '',
          content: newsData.content || '',
          status: newsData.status || 'draft',
          publishedAt: newsData.publishedAt ? new Date(newsData.publishedAt).toISOString().slice(0, 16) : '',
          coverImage: newsData.coverImage || '',
          is_recommended: newsData.is_recommended || false,
          tags: Array.isArray(newsData.tags) ? newsData.tags : [],
        });
        if (newsData.coverImage) {
          setImagePreview(newsData.coverImage);
        }
      } else {
        alert('Failed to fetch news data');
      }
    } catch (error) {
      console.error('Error fetching news data:', error);
      alert('Failed to fetch news data');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleTagAdd = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleSubmit = async (e: React.FormEvent, submitType: 'draft' | 'published' = 'published') => {
    e.preventDefault();
    setLoading(true);
    setLoadingType(submitType);

    try {
      // Upload image if selected
      const imageUrl = await uploadImage();
      if (selectedImage && !imageUrl) {
        setLoading(false);
        setLoadingType(null);
        return;
      }

      const submitData = {
        ...form,
        coverImage: imageUrl || form.coverImage,
        status: submitType,
        publishedAt: submitType === 'published' && !form.publishedAt ? new Date().toISOString() : form.publishedAt,
      };

      const url = mode === 'edit' && newsId
        ? `${ADMIN_ENDPOINTS.editNews}?id=${newsId}`
        : ADMIN_ENDPOINTS.editNews;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          title: submitData.title,
          slug: submitData.slug,
          excerpt: submitData.excerpt,
          content: submitData.content,
          status: submitData.status,
          publishedAt: submitData.publishedAt,
          coverImage: submitData.coverImage,
          is_recommended: submitData.is_recommended.toString(),
          tags: JSON.stringify(submitData.tags),
        }),
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          router.push('/admin/dashboard');
        } else {
          alert(result.message || 'Failed to save news');
        }
      } else {
        alert('Failed to save news');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save news');
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'edit' ? 'Edit News Article' : 'Add New News Article'}
        </h1>
        <p className="text-gray-600 mt-2">
          {mode === 'edit' ? 'Update the news article details below.' : 'Fill in the details to create a new news article.'}
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter news title"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="news-slug-url"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            name="excerpt"
            value={form.excerpt}
            onChange={handleInputChange}
            rows={3}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of the news article"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleInputChange}
            rows={15}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Full news article content (HTML allowed)"
          />
        </div>

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
            <input
              type="text"
              name="coverImage"
              value={form.coverImage}
              onChange={handleInputChange}
              placeholder="Or enter image URL"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Cover preview" className="w-32 h-48 object-cover rounded-lg shadow-md" />
              </div>
            )}
          </div>
        </div>

        {/* Status and Published Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Published Date</label>
            <input
              type="datetime-local"
              name="publishedAt"
              value={form.publishedAt}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_recommended"
              checked={form.is_recommended}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Recommended Article</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading || uploadingImage}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && loadingType === 'draft' ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && loadingType === 'published' ? 'Publishing...' : uploadingImage ? 'Uploading...' : (mode === 'edit' ? 'Update Article' : 'Publish Article')}
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