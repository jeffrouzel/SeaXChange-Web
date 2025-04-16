"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import WarningAlert from "@/components/WarningAlert";

import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, query, collection, where } from "firebase/firestore";
import { auth, db } from "@/firebase.config";

function generateCustomId(): string {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
}

async function generateUniqueCustomId(): Promise<string> {
  const customId = generateCustomId();
  const querySnapshot = await getDocs(
    query(collection(db, "users"), where("customId", "==", customId))
  );
  
  if (querySnapshot.empty) {
    return customId;
  }
  // If ID exists, try again recursively
  return generateUniqueCustomId();
}

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const verifySignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields!");
      setOpen(true);
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setOpen(true);
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setOpen(true);
      return false;
    }
    if (!/(?=.*\d)/.test(password)) {
      setError("Password should contain atleast 1 number.");
      setOpen(true);
      return false;
    }
    if (!/(?=.*[a-z])/.test(password)) {
      setError("Password should contain atleast 1 lowercase letter.");
      setOpen(true);
      return false;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setError("Password should contain atleast 1 uppercase letter.");
      setOpen(true);
      return false;
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      setError("Password should contain atleast 1 special character.");
      setOpen(true);
      return false;
    }
    setError(null); // Clear error if everything is fine
    return true;
  };

  const handleSignUp = async () => {
    try {
      if (!verifySignUp()) return;
      const response = await createUserWithEmailAndPassword(auth, email, password);

      const customId = await generateUniqueCustomId();
      const userDoc: {
        userId: string;
        customId: string;
        name: string;
        email: string;
        password: string;
        userType: string;
      } = {
        userId: response.user.uid,
        customId: customId,
        name: name,
        email: email,
        password: password,
        userType: "",
      };

      // Create a Firestore index for customId if you want to query by it
      await setDoc(doc(db, "users", response.user.uid), userDoc);

      router.push("/auth/signup-roles");
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
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
        <form className="w-full max-w-sm">
          <div className="mb-4">
            <Label htmlFor="name" className="text-teal-800 text-sm">
              Name
            </Label>
            <Input
              type="name"
              id="name"
              placeholder="Enter your name"
              className="w-full h-16"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email" className="text-teal-800 text-sm">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full h-16"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="text-teal-800 text-sm">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full h-16"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="text-teal-800 text-sm">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full h-16"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <WarningAlert message={error} open={open} onOpenChange={setOpen} />
          )}
          {/* <Button className="w-full bg-teal-800 hover:bg-teal-900 mt-4">
            Sign Up
          </Button> */}
          <Button
            type="button"
            onClick={handleSignUp}
            className="w-full bg-teal-800 hover:bg-teal-900 mt-4"
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-gray-500">or sign up with</p>
        <div className="flex space-x-4 mt-2">
          <button className="border border-teal-700 p-2 w-20 h-12 rounded">
            Google
          </button>
        </div>
        <p className="absolute bottom-10 left-4 mt-4 text-gray-500">
          Have an account?{" "}
          <Link href="/auth/login" className="text-teal-700 underline">
            Log in
          </Link>
        </p>
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
