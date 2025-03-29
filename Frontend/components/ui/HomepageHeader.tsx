"use client";
import { User, LogOut } from "lucide-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import ProfileContent from "@/components/ProfileContent";

import { useRouter } from 'next/navigation';

interface HomepageHeaderProps {
  title: string;
}

const HomepageHeader: React.FC<HomepageHeaderProps> = ({ title }) => {
  const router = useRouter();

  // Log Out
  const handleSignOut = () => {
    router.push("/auth/login");
  };

  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-teal-700 flex items-center">
        <img src="/seaxchange-logo.png" alt="SeaXChange" className="h-8 mr-2" />
        {title}
      </h1>
      <div className="flex gap-4">
        {/* Show Profile Information POPOVER */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-700">
              <User size={18} /> Profile
            </button>
          </PopoverTrigger>
          <ProfileContent />
        </Popover>
        {/* Sign Out Button */}
        <button 
          className="flex items-center gap-2 text-gray-700 hover:text-red-600"
          onClick={handleSignOut}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </header>
  );
};

export default HomepageHeader;
