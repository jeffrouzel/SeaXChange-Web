"use client";
import { User, LogOut, Menu } from "lucide-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import ProfileContent from "@/components/ProfileContent";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HomepageHeaderProps {
  title: string;
}

const HomepageHeader: React.FC<HomepageHeaderProps> = ({ title }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    router.push("/auth/login");
  };

  return (
    <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-teal-700 flex items-center">
        <img src="/tuna-logo.png" alt="SeaXChange" className="h-8 mr-2" />
        SeaXChange <span className="ml-2">{title}</span>
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-700">
              <User size={18} /> Profile
            </button>
          </PopoverTrigger>
          <ProfileContent />
        </Popover>
        <button
          className="flex items-center gap-2 text-gray-700 hover:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden relative">
        <button
          className="text-gray-700 hover:text-teal-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-teal-100 flex items-center gap-2">
                  <User size={18} /> Profile
                </button>
              </PopoverTrigger>
              <ProfileContent />
            </Popover>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 flex items-center gap-2"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HomepageHeader;
