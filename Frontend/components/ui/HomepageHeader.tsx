// "use client";
import { User, LogOut } from 'lucide-react';

interface HomepageHeaderProps {
  title: string;
}

const HomepageHeader: React.FC<HomepageHeaderProps> = ({ title }) => {
  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-teal-700 flex items-center">
        <img src="/seaxchange-logo.png" alt="SeaXChange" className="h-8 mr-2" />
        {title}
      </h1>
      <div className="flex gap-4">
        <button className="flex items-center gap-2 text-gray-700 hover:text-teal-700">
          <User size={18} /> Profile
        </button>
        <button className="flex items-center gap-2 text-gray-700 hover:text-red-600">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </header>
  );
};

export default HomepageHeader;
