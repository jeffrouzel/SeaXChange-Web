import { useEffect, useState } from "react";
import { PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.config";

interface UserData {
  name: string;
  userType: string;
  customId?: string;
}

const ProfileContent = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <PopoverContent className="w-80">
        <div>Loading...</div>
      </PopoverContent>
    );
  }

  return (
    <PopoverContent className="w-86">
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Profile Information</h4>
          <p className="text-xs text-muted-foreground">
            contact administration for any changes.
          </p>
        </div>

        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="name">Name:</Label>
            <p>{userData?.name || 'Not available'}</p>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="role">Role:</Label>
            <p>{userData?.userType || 'Not available'}</p>
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="id">User ID:</Label>
            <p className="text-sm truncate">{userData?.customId || auth.currentUser?.uid || 'Not available'}</p>
          </div>
        </div>
      </div>
    </PopoverContent>
  );
};

export default ProfileContent;
