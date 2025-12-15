'use client';

interface SlugInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function SlugInput({
  value,
  onChange,
  placeholder = "url-friendly-slug",
  required = true
}: SlugInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Slug</h3>
      <div className="flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 border border-gray-300 rounded-md"
          required={required}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        The slug is the URL-friendly version of the title.
      </p>
    </div>
  );
}