'use client';

interface ExcerptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  label?: string;
}

export default function ExcerptInput({
  value,
  onChange,
  placeholder = "Write a brief excerpt...",
  required = true,
  rows = 4,
  label = "Excerpt"
}: ExcerptInputProps) {
  const hasContent = value.trim().length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {hasContent && (
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border-none outline-none p-0 resize-none"
        required={required}
      />
    </div>
  );
}