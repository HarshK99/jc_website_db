import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS, API_ENDPOINTS } from '../lib/admin-config';

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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
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
                onChange={handleChange}
                placeholder="Write your post content here..."
                rows={20}
                className="w-full border-none outline-none p-0 resize-none"
              />
            </div>
          </div>

          {/* Sidebar */}
        
          <div className="space-y-6">
            {/* Publish Panel - Show in both modes but with different content */}
              {mode==='edit' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Status</h3>
              
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Current status:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      form.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {form.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                    <input
                      type="datetime-local"
                      name="publishedAt"
                      value={form.publishedAt}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              
              
            </div>
              )}

            {/* Featured Image */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Featured Image</h3>

              {imagePreview ? (
                // Image preview with controls
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview.startsWith('data:') ? imagePreview : imagePreview}
                      alt="Featured image preview"
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
                  <p className="text-sm text-gray-600 mb-4">Select Featured Image</p>
                  
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
                      className="inline-block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
                    >
                      Choose Image
                    </label>
                    <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, GIF, WebP (max 5MB)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              
              {/* Current tags display */}
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {form.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {/* Tag input */}
              <input
                type="text"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                onBlur={handleTagInputBlur}
                placeholder="Type tags separated by commas (e.g., reading, child-development)"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
              
              <p className="text-xs text-gray-500 mt-2">
                Type tags separated by commas. Press Enter to add them.
              </p>
              
              {/* Recommended checkbox */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_recommended"
                    checked={form.is_recommended}
                    onChange={(e) => setForm(prevForm => ({ ...prevForm, is_recommended: e.target.checked }))}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recommended Post</span>
                </label>
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

            {/* Delete Post - Only for edit mode */}
            {mode === 'edit' && (
              <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Once you delete this post, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                >
                  {loading ? 'Deleting...' : 'Delete this post'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}