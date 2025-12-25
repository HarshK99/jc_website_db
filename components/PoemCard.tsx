'use client';

import { useState } from 'react';
import { Poem } from '../lib/types';

interface PoemCardProps {
  poem: Poem;
}

export default function PoemCard({ poem }: PoemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          {poem.title}
        </h2>
        <p className="text-gray-600 italic mb-2">by {poem.author}</p>
        {poem.tags && poem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {poem.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {!isExpanded ? (
        <div>
          <p className="text-gray-700 mb-4 whitespace-pre-line">
            {poem.excerpt}
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Read Full Poem →
          </button>
        </div>
      ) : (
        <div>
          <div className="text-gray-800 mb-4 whitespace-pre-line font-serif leading-relaxed">
            {poem.content}
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Show Excerpt
          </button>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-4">
        Published on {new Date(poem.publishedAt).toLocaleDateString()}
      </div>
    </div>
  );
}