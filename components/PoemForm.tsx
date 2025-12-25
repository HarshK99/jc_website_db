'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ADMIN_ENDPOINTS } from '../lib/admin-config';
import { Poem } from '../lib/types';
import {
  TitleInput,
  ContentInput,
  PublishDateInput,
  DeleteSection
} from './admin';

interface PoemFormProps {
  mode: 'add' | 'edit';
  poemId?: string;
}

export default function PoemForm({ mode, poemId }: PoemFormProps) {
  const router = useRouter();
  const [loadingType, setLoadingType] = useState<'draft' | 'published' | null>(null);

  const [form, setForm] = useState({
    title: '',
    author: '',
    content: '',
    excerpt: '',
    status: 'draft',
    publishedAt: new Date().toISOString().slice(0, 16),
  });

  // Load existing data for edit mode
  useEffect(() => {
    if (mode === 'edit' && poemId) {
      const loadPoem = async () => {
        try {
          const response = await fetch(`${ADMIN_ENDPOINTS.editPoem}?id=${poemId}`, {
            credentials: 'include'
          });
          const data = await response.json();
          if (data) {
            setForm({
              title: data.title || '',
              author: data.author || '',
              content: data.content || '',
              excerpt: data.excerpt || '',
              status: data.status || 'draft',
              publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
            });
          }
        } catch (error) {
          console.error('Error loading poem:', error);
          alert('Failed to load poem data');
        }
      };

      loadPoem();
    }
  }, [mode, poemId]);

  const handleSubmit = async (status: 'draft' | 'published') => {
    setLoadingType(status);

    const submitData = {
      ...form,
      status,
    };

    try {
      const url = poemId
        ? `${ADMIN_ENDPOINTS.editPoem}?id=${poemId}`
        : ADMIN_ENDPOINTS.editPoem;

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
      alert('An error occurred while saving the poem');
    } finally {
      setLoadingType(null);
    }
  };

  const handleDelete = async () => {
    if (!poemId || !confirm('Are you sure you want to delete this poem? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${ADMIN_ENDPOINTS.editPoem}?id=${poemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        alert('Failed to delete poem');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete poem');
    }
  };

  const pageTitle = mode === 'add' ? 'Add Poem' : 'Edit Poem';
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
            <TitleInput
              value={form.title}
              onChange={(value) => setForm(prev => ({ ...prev, title: value }))}
            />

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief excerpt or first few lines of the poem"
              />
            </div>

            {/* Content */}
            <ContentInput
              value={form.content}
              onChange={(value) => setForm(prev => ({ ...prev, content: value }))}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Date */}
            <PublishDateInput
              value={form.publishedAt}
              onChange={(value) => setForm(prev => ({ ...prev, publishedAt: value }))}
            />

            {/* Delete Poem - Only for edit mode */}
            <DeleteSection
              isEditMode={mode === 'edit'}
              onDelete={handleDelete}
              loading={loadingType !== null}
              itemType="poem"
            />
          </div>
        </div>
      </div>
    </div>
  );
}