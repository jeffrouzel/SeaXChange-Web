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
    <header className="bg-white p-4 rounded-lg shadow-md mt-2">
      <div className="flex justify-between items-center w-full">
    {/* Logo and Brand */}
    <div className="flex items-center">
      <img
        src="/tuna-logo.png"
        alt="SeaXChange"
        className="h-4 md:h-6 mr-2"
      />
      <span className="text-sm md:text-xl lg:text-xl font-bold text-teal-700 whitespace-nowrap">
        SeaXChange
      </span>
    </div>

    {/* Page Title */}
    <div className="text-right md:text-center lg:text-center flex-1">
      <h1 className="text-sm md:text-xl lg:text-xl font-semibold text-teal-700">
        {title}
      </h1>
    </div>



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
            className="text-gray-700 hover:text-teal-700 ml-2 my-2"
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
      </div>
    </header>
  );
};

export default HomepageHeader;
