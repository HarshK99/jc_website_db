import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS, API_ENDPOINTS } from '../lib/admin-config';
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

interface PostFormData {
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

interface PostFormProps {
  mode: 'add' | 'edit';
  postId?: string;
}

export default function PostForm({ mode, postId }: PostFormProps) {
  const [form, setForm] = useState<PostFormData>({
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

  // Fetch post data for edit mode
  useEffect(() => {
    if (mode === 'edit' && postId) {
      fetchPost(postId);
    }
  }, [mode, postId]);

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`${ADMIN_ENDPOINTS.editPost}?id=${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.id) {
        const post = data;
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
          coverImage: post.coverImage || '',
          is_recommended: post.is_recommended || false,
          tags: post.tags || [],
        });
        // Set image preview if there's an existing image
        if (post.coverImage) {
          setImagePreview(post.coverImage);
        }
      }
    } catch (err) {
      console.error('Failed to fetch post:', err);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    console.log('handleSubmit called with status:', status);
    setLoading(true);
    setLoadingType(status);

    try {
      let coverImage = form.coverImage;

      // Upload image if selected but not yet uploaded
      if (selectedImage && !form.coverImage) {
        setUploadingImage(true);
        try {
          const formData = new FormData();
          formData.append('image', selectedImage);
          formData.append('folder', 'blog');

          const response = await fetch(ADMIN_ENDPOINTS.uploadImage, {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            coverImage = data.imageUrl;
            setForm(prevForm => ({ ...prevForm, coverImage: data.imageUrl }));
            setSelectedImage(null); // Clear after successful upload
          } else {
            const errorData = await response.json().catch(() => ({}));
            alert(`Failed to upload image: ${errorData.message || 'Unknown error'}`);
            setLoading(false);
            setLoadingType(null);
            setUploadingImage(false);
            return;
          }
        } catch (err) {
          alert('Error uploading image');
          setLoading(false);
          setLoadingType(null);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      let publishedAt = form.publishedAt;

      if (mode === 'add') {
        // For new posts, set publishedAt based on status
        publishedAt = status === 'published'
          ? new Date().toISOString().slice(0, 16) // Current time for published posts
          : ''; // Empty for drafts
      }
      // For edit mode, keep the existing publishedAt

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('slug', form.slug);
      formData.append('excerpt', form.excerpt);
      formData.append('content', form.content);
      formData.append('status', status);
      formData.append('publishedAt', publishedAt);
      formData.append('coverImage', coverImage);
      formData.append('is_recommended', form.is_recommended ? '1' : '0');
      
      // Add tags as array
      form.tags.forEach(tag => {
        formData.append('tags[]', tag);
      });
      const url = mode === 'edit' && postId
        ? ADMIN_ENDPOINTS.editPost + '?id=' + postId
        : ADMIN_ENDPOINTS.editPost;

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        if (data.message && data.message.includes('Session expired')) {
          alert('Your session has expired. Please login again.');
          router.push('/admin/login');
        } else {
          alert(`Failed to ${mode === 'add' ? 'create' : 'update'} post: ${data.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      alert(`Error ${mode === 'add' ? 'creating' : 'updating'} post`);
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setForm(prevForm => ({ ...prevForm, coverImage: '' }));
  };

  // Tag management functions
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTagsFromInput();
    }
  };

  const addTagsFromInput = () => {
    const newTags = tagInput
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag && !form.tags.includes(tag));

    if (newTags.length > 0) {
      setForm(prevForm => ({
        ...prevForm,
        tags: [...prevForm.tags, ...newTags]
      }));
    }

    setTagInput('');
  };

  const handleTagInputBlur = () => {
    if (tagInput.trim()) {
      addTagsFromInput();
    }
  };

  const removeTag = (index: number) => {
    setForm(prevForm => ({
      ...prevForm,
      tags: prevForm.tags.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const url = ADMIN_ENDPOINTS.editPost + '?id=' + postId;
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        if (data.message && data.message.includes('Session expired')) {
          alert('Your session has expired. Please login again.');
          router.push('/admin/login');
        } else {
          alert(`Failed to delete post: ${data.message || 'Unknown error'}`);
        }
      }
    } catch (err) {
      alert('Error deleting post');
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = mode === 'add' ? 'Add New Post' : 'Edit Post';
  const publishButtonText = loadingType === 'published'
    ? (mode === 'add' ? 'Publishing...' : 'Updating...')
    : (mode === 'add' ? 'Publish' : (form.status === 'published' ? 'Update' : 'Publish'));

  // Determine which buttons to show
  const showSaveDraftButton = mode === 'add' || (mode === 'edit' && form.status === 'draft'); // Show Save Draft for new posts and draft edits
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
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
              >
                {loadingType === 'draft' ? 'Saving...' : 'Save Draft'}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={loading}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
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
              placeholder="Write your post content here..."
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
              folder="posts"
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
              label="Recommended Post"
              title="Settings"
            />

            {/* Slug */}
            <SlugInput
              value={form.slug}
              onChange={(value) => setForm(prev => ({ ...prev, slug: value }))}
            />

            {/* Delete Post - Only for edit mode */}
            <DeleteSection
              isEditMode={mode === 'edit'}
              onDelete={handleDelete}
              loading={loading}
              itemType="post"
            />
          </div>
        </div>
      </div>
    </div>
  );
}