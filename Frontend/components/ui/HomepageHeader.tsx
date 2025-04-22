"use client";
import { User, LogOut, Menu, X } from "lucide-react";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import ProfileContent from "@/components/ProfileContent";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Import the ProfileContent component's content directly
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";
import { Label } from "@/components/ui/label";

interface HomepageHeaderProps {
  title: string;
}

const HomepageHeader: React.FC<HomepageHeaderProps> = ({ title }) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  
  const handleSignOutClick = () => {
    setShowSignOutConfirm(true);
  };
  
  const handleSignOutConfirm = () => {
    setShowSignOutConfirm(false);
    router.push("/auth/login");
  };
  
  const handleSignOutCancel = () => {
    setShowSignOutConfirm(false);
  };
  
  const auth = getAuth();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (menuOpen) {
      fetchUserData();
    }
  }, [menuOpen]);
  
  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  
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
            onClick={handleSignOutClick}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden relative">
          <button
            className="text-gray-700 hover:text-teal-700 ml-2 my-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Slide Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-teal-700">Menu</h3>
            <button 
              onClick={() => setMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Profile Information</h4>
                <p className="text-xs text-muted-foreground">
                  Contact administration for any changes.
                </p>
              </div>
              
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="name">Name:</Label>
                    <p className="text-sm">{userData?.name || 'Not available'}</p>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="role">Role:</Label>
                    <p className="text-sm">{userData?.userType ? capitalizeFirstLetter(userData.userType) : 'Not available'}</p>
                  </div>
                  <div className="grid grid-cols-2 items-center gap-2">
                    <Label htmlFor="id">User ID:</Label>
                    <p className="text-sm truncate">{userData?.customId || auth.currentUser?.uid || 'Not available'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-auto">
            <button
              onClick={handleSignOutClick}
              className="w-full text-left py-3 text-red-600 font-medium flex items-center gap-2 border-t border-gray-200 pt-4"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay when menu is open */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
      
      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Sign Out</h3>
              <p className="mb-6">Are you sure you want to sign out?</p>
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleSignOutCancel}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSignOutConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default HomepageHeader;