'use client';

interface DeleteSectionProps {
  isEditMode: boolean;
  onDelete: () => void;
  loading: boolean;
  itemType: string; // e.g., "post", "book", "news article", "current affairs item"
  buttonText?: string; // optional custom button text
}

export default function DeleteSection({
  isEditMode,
  onDelete,
  loading,
  itemType,
  buttonText
}: DeleteSectionProps) {
  if (!isEditMode) return null;

  const defaultButtonText = `Delete this ${itemType}`;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
      <p className="text-sm text-gray-600 mb-4">
        Once you delete this {itemType}, there is no going back. Please be certain.
      </p>
      <button
        type="button"
        onClick={onDelete}
        disabled={loading}
        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
      >
        {loading ? 'Deleting...' : (buttonText || defaultButtonText)}
      </button>
    </div>
  );
}