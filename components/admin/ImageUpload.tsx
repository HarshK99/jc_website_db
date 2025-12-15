'use client';

import { useState } from 'react';

interface ImageUploadProps {
  imagePreview: string;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  folder: string;
  disabled?: boolean;
}

export default function ImageUpload({
  imagePreview,
  onImageSelect,
  onRemoveImage,
  folder,
  disabled = false
}: ImageUploadProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  if (disabled) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Cover Image</h3>

      {imagePreview ? (
        // Image preview with controls
        <div className="space-y-4">
          <div className="relative">
            <img
              src={imagePreview.startsWith('data:') ? imagePreview : imagePreview}
              alt="Cover image preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-sm"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-green-600">✓ Image uploaded successfully</p>
        </div>
      ) : (
        // Upload area
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-2">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 mb-4">Select Cover Image</p>

          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={onImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
            >
              Choose Image
            </label>
            <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, GIF, WebP (max 5MB)</p>
          </div>
        </div>
      )}
    </div>
  );
}