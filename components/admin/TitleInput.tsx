'use client';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export default function TitleInput({ value, onChange, placeholder = "Add title", required = true }: TitleInputProps) {
  const hasContent = value.trim().length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {hasContent && (
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-2xl font-bold border-none outline-none p-0 placeholder-gray-400"
        required={required}
      />
    </div>
  );
}