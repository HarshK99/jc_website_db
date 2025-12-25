'use client';

import { useEffect, useState } from 'react';
import { fetchPoems } from '../../lib/api';
import PoemCard from '../../components/PoemCard';
import { Poem } from '../../lib/types';

export default function PoemsPageClient() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPoems = async () => {
      try {
        const data = await fetchPoems();
        setPoems(data);
      } catch (err) {
        console.error('Failed to load poems:', err);
        setError('Failed to load poems');
      } finally {
        setLoading(false);
      }
    };

    loadPoems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Poems
            </h1>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Poems
            </h1>
            <p className="text-red-600 mt-4">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Poems
          </h1>
          <p className="text-xl text-gray-600">
            Discover beautiful poetry from various authors
          </p>
        </div>

        {poems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No poems available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}