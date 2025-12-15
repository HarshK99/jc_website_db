'use client';

interface PublishDateInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function PublishDateInput({
  value,
  onChange,
  label = "Publish Date & Time"
}: PublishDateInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <p className="text-xs text-gray-500 mt-2">
        Leave empty to publish immediately when clicking Publish.
      </p>
    </div>
  );
}