interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search forum..."
      className="w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary-blue focus:outline-none"
    />
  );
}
