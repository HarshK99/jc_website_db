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

  // Fetch post data for edit mode
  useEffect(() => {
    if (mode === 'edit' && postId) {
      fetchPost(postId);
    }
  }, [mode, postId]);

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.posts}?id=${id}`);
      const data = await response.json();
      if (data.length > 0) {
        const post = data[0];
        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch post:', err);
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    setLoading(true);
    setLoadingType(status);

    try {
      let publishedAt = form.publishedAt;

      if (mode === 'add') {
        // For new posts, set publishedAt based on status
        publishedAt = status === 'published'
          ? new Date().toISOString().slice(0, 16) // Current time for published posts
          : ''; // Empty for drafts
      }
      // For edit mode, keep the existing publishedAt

      const formData = { ...form, status, publishedAt };
      const url = mode === 'edit' && postId
        ? ADMIN_ENDPOINTS.editPost + '?id=' + postId
        : ADMIN_ENDPOINTS.editPost;

      const response = await fetch(url, {
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
          alert(`Failed to ${mode === 'add' ? 'create' : 'update'} post: ${errorData.message || 'Unknown error'}`);
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

  const pageTitle = mode === 'add' ? 'Add New Post' : 'Edit Post';
  const publishButtonText = loadingType === 'published'
    ? (mode === 'add' ? 'Publishing...' : 'Updating...')
    : (mode === 'add' ? 'Publish' : 'Update');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
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
            {/* Publish/Update Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">{mode === 'add' ? 'Publish' : 'Update'}</h3>
              {mode === 'add' ? (
                <p className="text-sm text-gray-600">
                  Posts will be published immediately when you click &quot;Publish&quot;, or saved as drafts when you click &quot;Save Draft&quot;.
                </p>
              ) : (
                <div className="space-y-4">
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
              )}
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
      </div>
    </div>
  );
}