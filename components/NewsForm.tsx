import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS } from '../lib/admin-config';
import {
  TitleInput,
  ExcerptInput,
  ContentInput,
  SlugInput,
  ImageUpload,
  PublishDateInput,
  CheckboxField,
  TagsInput,
  StatusSelect,
  DeleteSection
} from './admin';

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
    publishedAt: new Date().toISOString().slice(0, 16),
    coverImage: '',
    is_recommended: false,
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'draft' | 'published' | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
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

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return form.coverImage;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('folder', 'news');

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
    if (!newsId || !confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${ADMIN_ENDPOINTS.editNews}?id=${newsId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Failed to delete news article');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete news article');
    }
  };

  const pageTitle = mode === 'edit' ? 'Edit News Analysis' : 'Add New News Analysis';
  const publishButtonText = mode === 'edit'
    ? (form.status === 'published' ? 'Update' : 'Publish')
    : 'Publish';

  // Determine which buttons to show
  const showSaveDraftButton = mode === 'add' || (mode === 'edit' && form.status === 'draft');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
          <div className="flex space-x-3">
            {showSaveDraftButton && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {loadingType === 'draft' ? 'Saving...' : 'Save Draft'}
              </button>
            )}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading}
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

            {/* Excerpt */}
            <ExcerptInput
              value={form.excerpt}
              onChange={(value) => setForm(prev => ({ ...prev, excerpt: value }))}
              placeholder="Write an excerpt (optional)"
              required={false}
            />

            {/* Content */}
            <ContentInput
              value={form.content}
              onChange={(value) => setForm(prev => ({ ...prev, content: value }))}
              placeholder="Write your news article content here..."
              rows={20}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Panel - Show in both modes but with different content */}
            {mode === 'edit' && (
              <StatusSelect
                value={form.status}
                onChange={(value) => setForm(prev => ({ ...prev, status: value }))}
                label="Status"
              />
            )}

            {/* Publish Date */}
            <PublishDateInput
              value={form.publishedAt}
              onChange={(value) => setForm(prev => ({ ...prev, publishedAt: value }))}
            />

            {/* Featured Image */}
            <ImageUpload
              imagePreview={imagePreview}
              onImageSelect={handleImageSelect}
              onRemoveImage={handleRemoveImage}
              folder="news"
            />

            {/* Tags */}
            <TagsInput
              tags={form.tags}
              onChange={(tags) => setForm(prev => ({ ...prev, tags }))}
              placeholder="Type tags separated by commas"
            />

            {/* Recommended checkbox */}
            <CheckboxField
              checked={form.is_recommended}
              onChange={(checked) => setForm(prev => ({ ...prev, is_recommended: checked }))}
              label="Recommended Article"
              title="Settings"
            />

            {/* Slug */}
            <SlugInput
              value={form.slug}
              onChange={(value) => setForm(prev => ({ ...prev, slug: value }))}
            />

            {/* Delete News - Only for edit mode */}
            <DeleteSection
              isEditMode={mode === 'edit'}
              onDelete={handleDelete}
              loading={loading}
              itemType="news article"
            />
          </div>
        </div>
      </div>
    </div>
  );
}