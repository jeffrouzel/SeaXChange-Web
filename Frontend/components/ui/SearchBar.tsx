import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onSearch }) => {
  return (
    <div className="relative w-64">
      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none"
        onChange={(e) => onSearch && onSearch(e.target.value)}
      />
      <Search className="absolute left-2 top-2 text-gray-500" size={18} />
    </div>
  );
};

export default SearchBar;
