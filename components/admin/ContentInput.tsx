'use client';

interface ContentInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export default function ContentInput({
  value,
  onChange,
  placeholder = "Write the content here...",
  required = true,
  rows = 12
}: ContentInputProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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