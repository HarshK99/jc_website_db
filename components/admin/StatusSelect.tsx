'use client';

interface StatusSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function StatusSelect({
  value,
  onChange,
  label = "Status"
}: StatusSelectProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>
  );
}