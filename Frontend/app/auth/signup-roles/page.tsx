"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { auth, db } from "@/firebase.config";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default function SignupRoles() {
  const router = useRouter();
  const [userType, setUserType] = useState(""); // store selected value

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      // Redirect to login page if no user is signed in
      router.push("/auth/login");
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!userType) {
      alert("Please select a user type!");
      return;
    }

    try {
      const currentUser = auth.currentUser; // Get the current user
      if (!currentUser) {
        throw new Error("No user is currently signed in.");
      }
      const userRef = doc(db, "users", currentUser.uid); // Reference to the user's document in Firestore
      const userDoc = await getDoc(userRef); // Check if the document exists

      if (!userDoc.exists()) {
        // If document doesn't exist, create it
        await setDoc(userRef, {
          userId: currentUser.uid,
          name: currentUser.displayName || "Unnamed",
          email: currentUser.email,
          userType: userType,
        });
      } else {
        // If the document exists, update the userType
        await updateDoc(userRef, { userType: userType });
      }
      router.push(`/homepage/${userType}`); // Redirect to the homepage based on user type
    } catch (error) {
      console.error("Error updating user type:", error);
      alert("An error occurred while updating user type. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side (Form) */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        {/* SeaXChange Logo */}
        <h1 className="absolute top-10 left-10 text-2xl font-bold mb-6 text-teal-700 flex items-center">
          <img src="/tuna-logo.png" alt="SeaXChange" className="h-8 mr-2" />
          SeaXChange
        </h1>

        <div className="mb-4">
          <Label htmlFor="userType" className="text-teal-800 text-sm text-l">
            You are a
          </Label>
          <select
            id="userType"
            className="w-full h-16 border border-gray-300 rounded px-4"
            value={userType} // Use value instead of selected
            onChange={(e) => setUserType(e.target.value)} // Update state on change
          >
            <option value="" disabled hidden>
              Select User Type
            </option>
            <option value="fisher">Fisher</option>
            <option value="supplier">Supplier</option>
            <option value="retailer">Retailer</option>
            <option value="consumer">Consumer</option>
          </select>
        </div>
        <Button
          className="w-lg bg-teal-800 hover:bg-teal-900"
          onClick={handleSubmit}
          disabled={!userType} // Disable button if no selection
        >
          Submit
        </Button>
      </div>
      {/* Right Side (Image/Graphic) */}
      <div className="w-1/2 bg-teal-800 flex flex-col justify-center items-center text-white">
        <img
          src="/tuna-background.jpg"
          alt="tuna"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
